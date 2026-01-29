'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Cart } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Loader, ArrowRight } from 'lucide-react';

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const getImageSrc = (image?: string): string | null => {
    if (!image || image.trim() === '') return null;

    if (image.startsWith('http')) {
      return image;
    }

    if (image.startsWith('public/')) {
      return image.replace('public/', '/');
    }

    return image.startsWith('/') ? image : `/${image}`;
  };

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {cart.items.map((item) => {
                  const imageSrc = getImageSrc(item.image);

                  return (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center gap-2"
                        >
                          {imageSrc && (
                            <Image
                              src={imageSrc}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="rounded object-cover"
                            />
                          )}
                          <span>{item.name}</span>
                        </Link>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={isPending}
                            onClick={() =>
                              startTransition(async () => {
                                await removeItemFromCart(item.productId);
                                router.refresh();
                              })
                            }
                          >
                            <Minus />
                          </Button>

                          <span>{item.qty}</span>

                          <Button
                            variant="outline"
                            size="icon"
                            disabled={isPending}
                            onClick={() =>
                              startTransition(async () => {
                                await addItemToCart({
                                  productId: item.productId,
                                  name: item.name,
                                  slug: item.slug,
                                  image: item.image,
                                  price: item.price,
                                  qty: 1,
                                });
                                router.refresh();
                              })
                            }
                          >
                            <Plus />
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        ${item.price.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className='p-4   gap-4'>
            <div className='pb-3 text-xl'>
              Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)}):
              {formatCurrency(cart.itemsPrice)}
            </div>
            <Button
            onClick={() => startTransition(() => router.push('/shipping-address'))}
            className='w-full'
            disabled={isPending}
            >
            {isPending ? (
              <Loader className='animate-spin w-4 h-4' />
            ) : (
              <ArrowRight className='w-4 h-4' />
            )}
            Proceed to Checkout
          </Button>
          </CardContent>
        </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
