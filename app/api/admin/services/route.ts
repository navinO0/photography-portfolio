import { NextResponse } from 'next/server';
import { getAdminSession } from '@/services/auth.service';
import { getAllServicesAdmin, createServiceAdmin } from '@/services/packages.service';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const services = await getAllServicesAdmin();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
    }

    const newService = await createServiceAdmin(body);
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Error creating service package:', error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}
