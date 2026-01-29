import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { notFound, redirect } from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from '@/types';
import { auth } from '@/auth';
import Stripe from 'stripe';

export const metadata: Metadata = {
  title: 'Order Details',
};

const OrderDetailsPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  if (
    order.userId !== session?.user.id &&
    session?.user.role !== 'admin'
  ) {
    redirect('/unauthorized');
  }

  /* ---------------- STRIPE PAYMENT INTENT ---------------- */
  let stripeClientSecret: string | null = null;

  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    const stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY as string
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'usd',
      metadata: { orderId: order.id },
    });

    stripeClientSecret = paymentIntent.client_secret;
  }

  /* ---------------- NORMALIZE ORDER (CRITICAL) ---------------- */
  const normalizedOrder = {
    ...order,
    itemsPrice: Number(order.itemsPrice),
    taxPrice: Number(order.taxPrice),
    shippingPrice: Number(order.shippingPrice),
    totalPrice: Number(order.totalPrice),
    shippingAddress: order.shippingAddress as ShippingAddress,
    orderItems: order.orderItems.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  };

  return (
    <OrderDetailsTable
      order={normalizedOrder}
      stripeClientSecret={stripeClientSecret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isAdmin={session?.user?.role === 'admin'}
    />
  );
};

export default OrderDetailsPage;
