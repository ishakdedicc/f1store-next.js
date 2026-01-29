'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { formatError } from '../utils';
import { cartItemSchema, insertCartSchema } from '../validator';
import { prisma } from '@/db/prisma';
import { CartItem } from '@/types';
import { Prisma } from '@prisma/client';
import { convertToPlainObject } from '../utils';
import { z } from 'zod';
import { round2 } from '../utils';

const calcPrice = (items: z.infer<typeof cartItemSchema>[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );

  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
}

export const addItemToCart = async (data: CartItem) => {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    const session = await auth();
    const userId = session?.user?.id;

    // Get existing cart
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
    });

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) throw new Error('Product not found');

    const images = JSON.parse(product.images);
    const image = Array.isArray(images) ? images[0] : null;

    const item: CartItem = cartItemSchema.parse({
      ...data,
      image,
    });

    // -----------------------------
    // CREATE CART
    // -----------------------------
    if (!cart) {
      const newCart = {
        userId,
        sessionCartId,
        items: [item],
        ...calcPrice([item]),
      };

      await prisma.cart.create({
        data: newCart,
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: 'Item added to cart',
      };
    }

    // -----------------------------
    // UPDATE CART
    // -----------------------------
    const existingItem = (cart.items as CartItem[]).find(
      (x) => x.productId === item.productId
    );

    let updatedItems: CartItem[];

    if (existingItem) {
      if (product.stock < existingItem.qty + 1) {
        throw new Error('Not enough stock');
      }

      updatedItems = (cart.items as CartItem[]).map((x) =>
        x.productId === item.productId
          ? { ...x, qty: x.qty + 1 }
          : x
      );
    } else {
      if (product.stock < 1) {
        throw new Error('Not enough stock');
      }

      updatedItems = [...(cart.items as CartItem[]), item];
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: updatedItems,
        ...calcPrice(updatedItems),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `Item ${
        existingItem ? 'updated in' : 'added to'
      } cart successfully`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export async function getMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) return undefined;

  const session = await auth();
  const userId = session?.user?.id;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  const items = await Promise.all(
    (cart.items as CartItem[]).map(async (item) => {
      if (item.image) return item;

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { images: true },
      });

      return {
        ...item,
        image: product?.images?.[0] ?? '', // ✅ always string
      };
    })
  );

  return {
    ...cart,
    items,
    itemsPrice: cart.itemsPrice,
    totalPrice: cart.totalPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
  };
}

export async function removeItemFromCart(productId: string) {
  try {
    // Get session cart id
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart Session not found');

    // Get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error('Product not found');

    // Get user cart
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    const items = cart.items as CartItem[];

    // Check if item exists
    const exist = items.find((x) => x.productId === productId);
    if (!exist) throw new Error('Item not found');

    let updatedItems: CartItem[];

    if (exist.qty === 1) {
      // Remove item
      updatedItems = items.filter((x) => x.productId !== productId);
    } else {
      // Decrease quantity
      updatedItems = items.map((x) =>
        x.productId === productId
          ? { ...x, qty: x.qty - 1 }
          : x
      );
    }

    // Update DB
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: updatedItems,
        ...calcPrice(updatedItems),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `Item ${
        updatedItems.find((x) => x.productId === productId)
          ? 'updated in'
          : 'removed from'
      } cart successfully`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
