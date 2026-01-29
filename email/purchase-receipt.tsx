import crypto from 'crypto';
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types';
import sampleData from '@/db/sample-data';

type OrderInformationProps = {
  order: Order;
};

/* ---------------- PREVIEW DATA (DEV ONLY) ---------------- */
PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    userId: '123',
    user: {
      name: 'John Doe',
      email: 'bS8Rn@example.com',
    },
    paymentMethod: 'Stripe',
    shippingAddress: {
      fullName: 'John Doe',
      streetAddress: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      country: 'US',
    },
    createdAt: new Date(),

    itemsPrice: 80,
    taxPrice: 10,
    shippingPrice: 10,
    totalPrice: 100,

    orderItems: sampleData.products.map((x) => ({
      productId: '123',
      slug: x.slug,
      image: x.images[0],
      name: x.name,
      qty: 1,
      price: x.price,
    })),

    isDelivered: true,
    deliveredAt: new Date(),
    isPaid: true,
    paidAt: new Date(),
    paymentResult: {
      id: '123',
      status: 'succeeded',
      pricePaid: '100.00',
      email_address: 'bS8Rn@example.com',
    },
  },
} satisfies OrderInformationProps;

/* ---------------- DATE FORMATTER ---------------- */
const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
});

/* ---------------- EMAIL COMPONENT ---------------- */
export default function PurchaseReceiptEmail({
  order,
}: {
  order: Order;
}) {
  return (
    <Html>
      <Preview>View your order receipt</Preview>

      <Tailwind>
        <Head />

        <Body className="font-sans bg-white">
          <Container className="max-w-xl mx-auto">
            <Heading>Purchase Receipt</Heading>

            {/* ORDER INFO */}
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 text-gray-500">Order ID</Text>
                  <Text className="mt-0">{order.id}</Text>
                </Column>

                <Column>
                  <Text className="mb-0 text-gray-500">Purchased On</Text>
                  <Text className="mt-0">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>

                <Column>
                  <Text className="mb-0 text-gray-500">Price Paid</Text>
                  <Text className="mt-0">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* ITEMS */}
            <Section className="border border-gray-300 rounded-lg p-4 my-4">
              {order.orderItems.map((item) => (
                <Row key={item.productId} className="mt-6">
                  <Column className="w-20">
                    <Img
                      width="80"
                      alt={item.name}
                      className="rounded"
                      src={
                        item.image.startsWith('/')
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}${item.image}`
                          : item.image
                      }
                    />
                  </Column>

                  <Column>
                    <Text className="mx-2 my-0">
                      {item.name} × {item.qty}
                    </Text>
                  </Column>

                  <Column align="right">
                    <Text className="m-0">
                      {formatCurrency(item.price)}
                    </Text>
                  </Column>
                </Row>
              ))}

              {/* TOTALS */}
              {[
                { name: 'Items', price: order.itemsPrice },
                { name: 'Tax', price: order.taxPrice },
                { name: 'Shipping', price: order.shippingPrice },
                { name: 'Total', price: order.totalPrice },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1">
                  <Column align="right">{name}:</Column>
                  <Column align="right" width={80}>
                    <Text className="m-0">
                      {formatCurrency(price)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
