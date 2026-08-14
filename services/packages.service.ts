import { db } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function getAllServicesAdmin() {
  const tenantId = getTenantId();
  return db.service.findMany({
    where: { tenantId },
    orderBy: { displayOrder: 'asc' },
  });
}

export async function getServiceByIdAdmin(id: string) {
  const tenantId = getTenantId();
  return db.service.findFirst({
    where: { id, tenantId },
  });
}

export async function createServiceAdmin(data: {
  name: string;
  slug?: string;
  description: string;
  priceStarting?: string;
  features?: string[];
  image?: string;
  displayOrder?: number;
  isActive?: boolean;
}) {
  const tenantId = getTenantId();
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return db.service.create({
    data: {
      tenantId,
      name: data.name,
      slug,
      description: data.description,
      priceStarting: data.priceStarting || null,
      features: data.features || [],
      image: data.image || null,
      displayOrder: data.displayOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateServiceAdmin(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    priceStarting?: string;
    features?: string[];
    image?: string;
    displayOrder?: number;
    isActive?: boolean;
  }
) {
  const tenantId = getTenantId();

  return db.service.updateMany({
    where: { id, tenantId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priceStarting !== undefined && { priceStarting: data.priceStarting }),
      ...(data.features !== undefined && { features: data.features }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}

export async function deleteServiceAdmin(id: string) {
  const tenantId = getTenantId();
  return db.service.deleteMany({
    where: { id, tenantId },
  });
}
