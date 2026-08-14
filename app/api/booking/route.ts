import { NextResponse } from 'next/server';
import { createBooking } from '@/services/booking.service';
import { z } from 'zod';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  eventType: z.string().min(2),
  eventDate: z.string().min(1),
  location: z.string().min(2),
  guestCount: z.string().optional(),
  budgetRange: z.string().optional(),
  requirements: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = bookingSchema.parse(body);

    const booking = await createBooking({
      ...validated,
      eventDate: new Date(validated.eventDate),
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Invalid input data' },
      { status: 400 }
    );
  }
}
