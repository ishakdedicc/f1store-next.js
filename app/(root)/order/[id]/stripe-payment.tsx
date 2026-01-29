'use client';

import { FormEvent, useState } from 'react';
import {
  PaymentElement,
  LinkAuthenticationElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { SERVER_URL } from '@/lib/constants';

const StripePayment = ({
  priceInCents,
  orderId,
  clientSecret,
}: {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? 'Payment failed');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Stripe Checkout</h3>

      {errorMessage && (
        <div className="text-destructive">{errorMessage}</div>
      )}

      <PaymentElement />

      <LinkAuthenticationElement />

      <Button
        className="w-full"
        size="lg"
        disabled={!stripe || !elements || isLoading}
      >
        {isLoading
          ? 'Processing...'
          : `Pay ${formatCurrency(priceInCents / 100)}`}
      </Button>
    </form>
  );
};

export default StripePayment;
