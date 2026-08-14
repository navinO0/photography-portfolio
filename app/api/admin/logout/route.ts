import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/services/auth.service';

export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
