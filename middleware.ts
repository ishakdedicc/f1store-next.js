import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;

  const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/,
    /\/place-order/,
    /\/profile/,
    /\/user\/(.*)/,
    /\/admin/,
  ];

  const isProtected = protectedPaths.some((path) =>
    path.test(nextUrl.pathname)
  );

  if (!req.auth && isProtected) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Create session cart if missing
  if (!req.cookies.get('sessionCartId')) {
    const response = NextResponse.next();
    response.cookies.set('sessionCartId', crypto.randomUUID(), {
      httpOnly: true,
      path: '/',
    });
    return response;
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
