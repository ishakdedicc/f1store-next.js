import { notFound } from 'next/navigation';

import { getProductBySlug } from '@/lib/actions/product.actions';
import { getMyCart } from '@/lib/actions/cart.actions';

import ProductImages from '@/components/shared/product/product-images';
import ProductPrice from '@/components/shared/product/product-price';
import AddToCart from '@/components/shared/product/add-to-cart';
import Rating from '@/components/shared/product/rating';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { auth } from '@/auth';
import ReviewList from './review-list';

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const images: string[] = Array.isArray(product.images)
    ? product.images
    : JSON.parse(product.images);

  const cart = await getMyCart();
  const safeCart = cart
    ? {
        sessionCartId: cart.sessionCartId,
        itemsPrice: Number(cart.itemsPrice),
        shippingPrice: Number(cart.shippingPrice),
        taxPrice: Number(cart.taxPrice),
        totalPrice: Number(cart.totalPrice),
        items: cart.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          slug: item.slug,
          qty: item.qty,
          image: item.image,
          price: Number(item.price),
        })),
      }
    : undefined;

  const session = await auth();
  const userId = session?.user?.id ?? '';

  return (
    <>
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-6'>
          <div className='col-span-2'>
            <ProductImages images={images} />
          </div>
          <div className='col-span-2 p-5 space-y-4'>
            <p className='text-sm text-muted-foreground'>
              {product.brand} / {product.category}
            </p>

            <h1 className='h3-bold'>{product.name}</h1>
            <div className='flex items-center gap-2'>
              <Rating value={Number(product.rating)} />
              <span className='text-sm text-muted-foreground'>
                {product.numReviews} reviews
              </span>
            </div>

            <ProductPrice
              value={Number(product.price)}
              className='bg-green-100 text-green-700 px-4 py-1 rounded-full w-fit'
            />

            <div className='pt-4'>
              <p className='font-semibold'>Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className='p-4 space-y-4'>
                <div className='flex justify-between'>
                  <span>Price</span>
                  <ProductPrice value={Number(product.price)} />
                </div>

                <div className='flex justify-between'>
                  <span>Status</span>
                  {product.stock > 0 ? (
                    <Badge variant='outline'>In stock</Badge>
                  ) : (
                    <Badge variant='destructive'>Out of stock</Badge>
                  )}
                </div>

                {product.stock > 0 && images.length > 0 && (
                  <AddToCart
                    cart={safeCart}
                    item={{
                      productId: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: Number(product.price),
                      qty: 1,
                      image: images[0],
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className='mt-10'>
        <h2 className='h2-bold mb-5'>Customer Reviews</h2>

        <ReviewList
          productId={product.id}
          productSlug={product.slug}
          userId={userId}
        />
      </section>
    </>
  );
}
