'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { signIn } from 'next-auth/react';

const CredentialsSignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (data?.success) {
      router.push(callbackUrl);
    }
  }, [data, callbackUrl, router]);

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full">
        {pending ? 'Signing In...' : 'Sign In'}
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signIn('google', { callbackUrl })}
      >
        Continue with Google
      </Button>

      {/* divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <form action={action} className="space-y-6">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            required
            type="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>

        <SignInButton />

        {!data.success && data.message && (
          <div className="text-center text-destructive">
            {data.message}
          </div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link className="link" href="/sign-up">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CredentialsSignInForm;
