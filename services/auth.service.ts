import { db } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lumina-super-secret-photography-key-2026'
);
const COOKIE_NAME = 'lumina_admin_token';

export async function verifyAdminCredentials(emailInput: string, passwordPlain: string) {
  const tenantId = getTenantId();
  const normalizedEmail = emailInput.trim().toLowerCase();

  // Support 'admin' / 'admin' or 'admin@luminastudios.com' / 'admin' credentials
  if (
    (normalizedEmail === 'admin' || normalizedEmail === 'admin@luminastudios.com') &&
    (passwordPlain === 'admin' || passwordPlain === 'Admin@123456')
  ) {
    return {
      id: 'admin-default-id',
      email: 'admin@luminastudios.com',
      name: 'Admin',
      role: 'ADMIN',
      tenantId,
    };
  }

  const user = await db.user.findUnique({
    where: {
      tenantId_email: {
        tenantId,
        email: normalizedEmail,
      },
    },
  });

  if (!user) return null;

  const passwordMatches = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!passwordMatches) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenantId: user.tenantId,
  };
}

export async function createAdminSession(user: { id: string; email: string; name: string; tenantId: string }) {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    tenantId: user.tenantId,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return token;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; email: string; name: string; tenantId: string };
  } catch (err) {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
