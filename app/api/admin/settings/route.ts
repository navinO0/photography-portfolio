import { NextResponse } from 'next/server';
import { updateTenantSettings } from '@/services/settings.service';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = await updateTenantSettings(body);

    // Revalidate public routes to reflect saved theme settings immediately
    revalidatePath('/', 'layout');
    revalidatePath('/portfolio', 'layout');
    revalidatePath('/services', 'layout');
    revalidatePath('/booking', 'layout');
    revalidatePath('/admin/settings', 'page');

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('Failed to update tenant settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
