import { db } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function getCategories() {
  const tenantId = getTenantId();
  return db.portfolioCategory.findMany({
    where: { tenantId, isActive: true },
    orderBy: { displayOrder: 'asc' },
  });
}

export async function getAllCategoriesAdmin() {
  const tenantId = getTenantId();
  return db.portfolioCategory.findMany({
    where: { tenantId },
    orderBy: { displayOrder: 'asc' },
  });
}

export async function getFeaturedProjects() {
  const tenantId = getTenantId();
  return db.portfolioProject.findMany({
    where: { tenantId, isPublished: true, featured: true },
    include: {
      category: true,
      images: {
        orderBy: { displayOrder: 'asc' },
      },
    },
    orderBy: { displayOrder: 'asc' },
  });
}

export async function getProjectsByCategory(categorySlug?: string) {
  const tenantId = getTenantId();
  const where: any = { tenantId, isPublished: true };

  if (categorySlug && categorySlug !== 'all') {
    const category = await db.portfolioCategory.findFirst({
      where: { tenantId, slug: categorySlug },
    });
    if (category) {
      where.categoryId = category.id;
    }
  }

  return db.portfolioProject.findMany({
    where,
    include: {
      category: true,
      images: {
        orderBy: { displayOrder: 'asc' },
      },
    },
    orderBy: { displayOrder: 'asc' },
  });
}

export async function getProjectBySlug(slug: string) {
  const tenantId = getTenantId();
  return db.portfolioProject.findFirst({
    where: { tenantId, slug, isPublished: true },
    include: {
      category: true,
      images: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  });
}

export async function getRelatedProjects(currentProjectId: string, categoryId: string, limit = 3) {
  const tenantId = getTenantId();
  return db.portfolioProject.findMany({
    where: {
      tenantId,
      isPublished: true,
      categoryId,
      id: { not: currentProjectId },
    },
    include: { category: true },
    orderBy: { displayOrder: 'asc' },
    take: limit,
  });
}

// Admin Operations
export async function getAllProjectsAdmin() {
  const tenantId = getTenantId();
  return db.portfolioProject.findMany({
    where: { tenantId },
    include: {
      category: true,
      images: {
        orderBy: { displayOrder: 'asc' },
      },
    },
    orderBy: { displayOrder: 'asc' },
  });
}

export async function createProject(data: {
  title: string;
  slug: string;
  categoryId: string;
  description?: string;
  location?: string;
  eventDate?: Date;
  coverImage: string;
  layoutMode?: string;
  featured?: boolean;
  isPublished?: boolean;
  images?: { imageUrl: string; altText?: string }[];
}) {
  const tenantId = getTenantId();

  return db.portfolioProject.create({
    data: {
      tenantId,
      title: data.title,
      slug: data.slug,
      categoryId: data.categoryId,
      description: data.description,
      location: data.location,
      eventDate: data.eventDate,
      coverImage: data.coverImage,
      layoutMode: data.layoutMode || 'masonry',
      featured: data.featured || false,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      images: {
        create: (data.images || []).map((img, idx) => ({
          tenantId,
          imageUrl: img.imageUrl,
          altText: img.altText || data.title,
          displayOrder: idx + 1,
        })),
      },
    },
  });
}

export async function updateProject(
  id: string,
  data: {
    title?: string;
    slug?: string;
    categoryId?: string;
    description?: string;
    location?: string;
    eventDate?: Date;
    coverImage?: string;
    layoutMode?: string;
    featured?: boolean;
    isPublished?: boolean;
    displayOrder?: number;
  }
) {
  const tenantId = getTenantId();
  return db.portfolioProject.updateMany({
    where: { id, tenantId },
    data,
  });
}

export async function deleteProject(id: string) {
  const tenantId = getTenantId();
  return db.portfolioProject.deleteMany({
    where: { id, tenantId },
  });
}

export async function updateImageOrder(projectId: string, imageIdsInOrder: string[]) {
  const tenantId = getTenantId();
  const updates = imageIdsInOrder.map((imageId, index) =>
    db.portfolioImage.updateMany({
      where: { id: imageId, projectId, tenantId },
      data: { displayOrder: index + 1 },
    })
  );
  return db.$transaction(updates);
}

export async function addProjectImage(projectId: string, imageUrl: string, altText?: string) {
  const tenantId = getTenantId();
  const count = await db.portfolioImage.count({ where: { projectId, tenantId } });
  return db.portfolioImage.create({
    data: {
      tenantId,
      projectId,
      imageUrl,
      altText,
      displayOrder: count + 1,
    },
  });
}

export async function deleteProjectImage(imageId: string) {
  const tenantId = getTenantId();
  return db.portfolioImage.deleteMany({
    where: { id: imageId, tenantId },
  });
}

export async function updateProjectImage(imageId: string, data: { imageUrl?: string; altText?: string }) {
  const tenantId = getTenantId();
  return db.portfolioImage.updateMany({
    where: { id: imageId, tenantId },
    data,
  });
}
