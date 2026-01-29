import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderToPaid, sendOrderEmailSafe } from '@/lib/actions/order.actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const orderId = paymentIntent.metadata.orderId;
    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId in metadata' },
        { status: 400 }
      );
    }

    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        email_address: paymentIntent.receipt_email ?? '',
        pricePaid: (paymentIntent.amount_received / 100).toFixed(2),
      },
    });
    sendOrderEmailSafe(paymentIntent.metadata.orderId);
  }

  return NextResponse.json({ received: true });
}
