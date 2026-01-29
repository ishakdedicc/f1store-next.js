'use client';

import { useFormStatus } from 'react-dom';
import { createOrder } from '@/lib/actions/order.actions';
import { Button } from '@/components/ui/button';
import { Check, Loader } from 'lucide-react';

const PlaceOrderButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Check className="w-4 h-4" />
          Place Order
        </>
      )}
    </Button>
  );
};

const PlaceOrderForm = () => {
  return (
    <form action={createOrder}>
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
