import { redirect } from 'next/navigation';
import { getMyCart } from '@/lib/actions/cart.actions';
import CartTable from './cart-table';
import { CartItem } from '@/types';

const CartPage = async () => {
  const cart = await getMyCart();

  if (!cart) {
    redirect('/');
  }

  const safeCart = {
    sessionCartId: cart.sessionCartId!,
    itemsPrice: Number(cart.itemsPrice),
    shippingPrice: Number(cart.shippingPrice),
    taxPrice: Number(cart.taxPrice),
    totalPrice: Number(cart.totalPrice),

    items: cart.items.map((item: CartItem) => ({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      qty: item.qty,
      image: item.image,
      price: Number(item.price),
    })),
  };

  return <CartTable cart={safeCart} />;
};

export default CartPage;
