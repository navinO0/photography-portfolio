import { NextResponse } from 'next/server';
import {
  getAllProjectsAdmin,
  getCategories,
  createProject,
  updateProject,
  deleteProject,
  addProjectImage,
  updateProjectImage,
  deleteProjectImage,
} from '@/services/portfolio.service';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const [projects, categories] = await Promise.all([
      getAllProjectsAdmin(),
      getCategories(),
    ]);
    return NextResponse.json({ projects, categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if adding an image to an existing project
    if (body.action === 'addImage') {
      const { projectId, imageUrl, altText } = body;
      if (!projectId || !imageUrl) {
        return NextResponse.json({ error: 'Missing projectId or imageUrl' }, { status: 400 });
      }
      const newImage = await addProjectImage(projectId, imageUrl, altText);
      revalidatePath('/portfolio');
      revalidatePath('/portfolio/[slug]', 'page');
      return NextResponse.json({ success: true, image: newImage });
    }

    // Check if updating an existing work image
    if (body.action === 'updateImage') {
      const { imageId, imageUrl, altText } = body;
      if (!imageId || !imageUrl) {
        return NextResponse.json({ error: 'Missing imageId or imageUrl' }, { status: 400 });
      }
      await updateProjectImage(imageId, { imageUrl, altText });
      revalidatePath('/portfolio');
      revalidatePath('/portfolio/[slug]', 'page');
      return NextResponse.json({ success: true });
    }

    // Creating a new project
    const {
      title,
      slug,
      categoryId,
      description,
      location,
      coverImage,
      layoutMode,
      featured,
      isPublished,
      galleryImages,
    } = body;

    if (!title || !categoryId || !coverImage) {
      return NextResponse.json(
        { error: 'Title, Category, and Cover Image are required' },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const imagesToCreate = Array.isArray(galleryImages)
      ? galleryImages.map((imgUrl: string) => ({ imageUrl: imgUrl, altText: title }))
      : [];

    const project = await createProject({
      title,
      slug: generatedSlug,
      categoryId,
      description,
      location,
      coverImage,
      layoutMode: layoutMode || 'editorial',
      featured: Boolean(featured),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      images: imagesToCreate,
    });

    revalidatePath('/portfolio');
    revalidatePath('/');
    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      categoryId,
      description,
      location,
      coverImage,
      layoutMode,
      featured,
      isPublished,
    } = body;

    if (!id || !title || !categoryId || !coverImage) {
      return NextResponse.json(
        { error: 'ID, Title, Category, and Cover Image are required for updates' },
        { status: 400 }
      );
    }

    await updateProject(id, {
      title,
      categoryId,
      description,
      location,
      coverImage,
      layoutMode: layoutMode || 'editorial',
      featured: Boolean(featured),
      isPublished: Boolean(isPublished),
    });

    revalidatePath('/portfolio');
    revalidatePath('/portfolio/[slug]', 'page');
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const imageId = searchParams.get('imageId');

    if (imageId) {
      await deleteProjectImage(imageId);
      revalidatePath('/portfolio');
      return NextResponse.json({ success: true });
    }

    if (projectId) {
      await deleteProject(projectId);
      revalidatePath('/portfolio');
      revalidatePath('/');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Missing projectId or imageId parameter' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
