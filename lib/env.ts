import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  TENANT_ID: z.string().default('tenant_001'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters long'),
  NEXT_PUBLIC_SITE_URL: z.string().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Lumina Studios'),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional().default('15552345678'),
});

function validateEnv() {
  const result = envSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    TENANT_ID: process.env.TENANT_ID,
    JWT_SECRET: process.env.JWT_SECRET || 'lumina-super-secret-photography-key-2026',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  });

  if (!result.success) {
    console.error('❌ Environment Variable Configuration Errors:', result.error.flatten().fieldErrors);
    throw new Error('Invalid environment configuration. Please check your .env file.');
  }

  return result.data;
}

export const env = validateEnv();
