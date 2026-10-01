import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// We must use jose for edge middleware because jsonwebtoken uses node crypto which is unavailable in Edge runtime.
const JWT_SECRET = process.env.JWT_SECRET || "default_unsafe_secret_for_dev_only";

export async function proxy(req: NextRequest) {
  // Only protect API routes under /api/v1/ (exclude auth routes)
  if (req.nextUrl.pathname.startsWith('/api/v1/') && !req.nextUrl.pathname.startsWith('/api/auth/')) {
    
    // 1. Allow if x-api-key is present (for programmatic access)
    // Actually api keys should be validated against DB, but middleware can't use Prisma.
    // For now, if there is a bearer token, we validate it.
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      // Role Based Access Control (RBAC)
      if (req.nextUrl.pathname.startsWith('/api/v1/settings') || req.nextUrl.pathname.startsWith('/api/v1/users')) {
        if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'OWNER') {
          return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 });
        }
      }

      return NextResponse.next();
    } catch (error) {
      console.error('JWT Verification failed:', error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/v1/:path*'],
};
