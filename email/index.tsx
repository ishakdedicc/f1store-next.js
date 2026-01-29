import { Resend } from 'resend';
import { render } from '@react-email/render';
import PurchaseReceiptEmail from './purchase-receipt';
import { APP_NAME, SENDER_EMAIL } from '@/lib/constants';
import { Order } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendPurchaseReceipt({
  order,
}: {
  order: Order;
}) {
  const html = await render(
    PurchaseReceiptEmail({ order })
  );

  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: order.user.email,
    subject: `Order Confirmation ${order.id}`,
    html,
  });
}
