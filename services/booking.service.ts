import { db } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function createBooking(data: {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: Date;
  location: string;
  guestCount?: string;
  budgetRange?: string;
  requirements?: string;
  message?: string;
}) {
  const tenantId = getTenantId();
  return db.booking.create({
    data: {
      tenantId,
      ...data,
      status: 'PENDING',
    },
  });
}

export async function getBookingsAdmin() {
  const tenantId = getTenantId();
  return db.booking.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateBookingStatus(id: string, status: string) {
  const tenantId = getTenantId();
  return db.booking.updateMany({
    where: { id, tenantId },
    data: { status },
  });
}

// Availability Calendar
export async function getAvailabilities() {
  const tenantId = getTenantId();
  return db.availability.findMany({
    where: { tenantId },
    orderBy: { date: 'asc' },
  });
}

export async function setDateAvailability(date: Date, status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED', notes?: string) {
  const tenantId = getTenantId();
  return db.availability.upsert({
    where: {
      tenantId_date: {
        tenantId,
        date,
      },
    },
    update: { status, notes },
    create: {
      tenantId,
      date,
      status,
      notes,
    },
  });
}

// Contact Inquiries
export async function createContactInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const tenantId = getTenantId();
  return db.contactInquiry.create({
    data: {
      tenantId,
      ...data,
    },
  });
}

export async function getContactInquiriesAdmin() {
  const tenantId = getTenantId();
  return db.contactInquiry.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
  });
}

// Services
export async function getActiveServices() {
  const tenantId = getTenantId();
  return db.service.findMany({
    where: { tenantId, isActive: true },
    orderBy: { displayOrder: 'asc' },
  });
}

// Testimonials
export async function getPublishedTestimonials() {
  const tenantId = getTenantId();
  return db.testimonial.findMany({
    where: { tenantId, isPublished: true },
    orderBy: { displayOrder: 'asc' },
  });
}
