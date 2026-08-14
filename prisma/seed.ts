import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const tenantId = process.env.TENANT_ID || 'tenant_001';

  console.log(`🌱 Seeding database for Tenant ID: ${tenantId}...`);

  // 1. Create or Update Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'lumina-studios' },
    update: {
      name: 'Lumina Cinematic Studios',
      status: 'ACTIVE',
    },
    create: {
      id: tenantId,
      name: 'Lumina Cinematic Studios',
      slug: 'lumina-studios',
      status: 'ACTIVE',
    },
  });

  // 2. Tenant Settings & Branding
  await prisma.tenantSettings.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      logo: '/images/logo-lumina.svg',
      favicon: '/favicon.ico',
      primaryColor: '#f59e0b',
      secondaryColor: '#0f172a',
      accentColor: '#fbbf24',
      fontFamily: 'Playfair Display, serif',
      photographerName: 'Elena Vance & Marcus Thorne',
      photographerTitle: 'Master Fine Art & Cinematic Photographers',
      bio: 'We craft timeless, emotion-filled visual sagas for royal celebrations, destination weddings, and high-fashion portraiture worldwide.',
      phone: '+1 (555) 892-4011',
      whatsapp: '15558924011',
      email: 'concierge@luminastudios.com',
      address: '740 Park Avenue, Studio 12B, New York, NY 10021',
      socialInstagram: 'https://instagram.com/luminastudios',
      socialFacebook: 'https://facebook.com/luminastudios',
      socialYoutube: 'https://youtube.com/@luminastudios',
      heroTitle: 'CAPTIVATING WEDDING PORTRAITS THAT SPEAK EMOTIONS.',
      heroSubtitle: 'Timeless portraits for everlasting memories. Award-winning luxury photography for destination weddings and editorial sagas.',
      heroMediaUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop',
      seoTitle: 'Lumina Studios | Luxury Destination Wedding & Fine Art Photography',
      seoDescription: 'World-class cinematic photography studio serving destination weddings, fine art portraits, and fashion sagas.',
      featureFlags: {
        bookingEnabled: true,
        testimonialsEnabled: true,
        customCursor: true,
        smoothScroll: true,
        threeDEffects: true,
      },
    },
  });

  // 3. Admin User
  const passwordHash = await bcrypt.hash('Admin@123456', 10);
  await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: 'admin@luminastudios.com',
      },
    },
    update: { passwordHash },
    create: {
      tenantId: tenant.id,
      email: 'admin@luminastudios.com',
      passwordHash,
      name: 'Elena Vance',
      role: 'ADMIN',
    },
  });

  // 4. Portfolio Categories Inspired by Screenshots
  const categoriesData = [
    {
      name: 'Fine Art Portraits',
      slug: 'portraits',
      description: 'Intimate, emotion-filled frames capturing timeless grace and individuality.',
      coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
      displayOrder: 1,
    },
    {
      name: 'Pre Weddings & Engagements',
      slug: 'pre-weddings',
      description: 'Ethereal romantic sagas captured across iconic coastal & architectural sanctuaries.',
      coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop',
      displayOrder: 2,
    },
    {
      name: 'Royal Destination Weddings',
      slug: 'royal-weddings',
      description: 'Grand palace & chateau celebrations rendered with cinematic majesty.',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
      displayOrder: 3,
    },
    {
      name: 'Traditional & Cultural Ceremonies',
      slug: 'traditional-weddings',
      description: 'Rich heritage, sacred rituals, and vibrant ceremonial emotions.',
      coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
      displayOrder: 4,
    },
    {
      name: 'Haute Couture & Fashion',
      slug: 'fashion',
      description: 'Magazine covers, runway campaigns, and high-fashion editorial portraiture.',
      coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop',
      displayOrder: 5,
    },
    {
      name: 'Luxury Galas & Commercial Summits',
      slug: 'commercial',
      description: 'Red carpet events, VIP summits, and high-profile brand unveilings.',
      coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
      displayOrder: 6,
    },
  ];

  const createdCategories: Record<string, string> = {};

  for (const cat of categoriesData) {
    const category = await prisma.portfolioCategory.upsert({
      where: {
        tenantId_slug: {
          tenantId: tenant.id,
          slug: cat.slug,
        },
      },
      update: cat,
      create: {
        tenantId: tenant.id,
        ...cat,
      },
    });
    createdCategories[cat.slug] = category.id;
  }

  // 5. Portfolio Projects & Images
  const projectsData = [
    {
      title: 'The Chateau De Chantilly Royal Celebration',
      slug: 'chateau-de-chantilly-royal-wedding',
      categoryId: createdCategories['royal-weddings'],
      description: 'A 3-day royal celebration in France featuring candlelit courtyards, custom couture, and champagne toasts under starry skies.',
      location: 'Chantilly, France',
      eventDate: new Date('2025-06-18'),
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
      layoutMode: 'editorial',
      featured: true,
      displayOrder: 1,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop', altText: 'Bride and Groom in Courtyard' },
        { imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop', altText: 'Candlelit Banquet Hall' },
        { imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop', altText: 'First Kiss at Sunset' },
        { imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1600&auto=format&fit=crop', altText: 'Couture Veil Detail' },
      ],
    },
    {
      title: 'Whispers of Amalfi - Coastal Romance',
      slug: 'whispers-of-amalfi-pre-wedding',
      categoryId: createdCategories['pre-weddings'],
      description: 'An ethereal pre-wedding saga captured along cliffside villas in Positano and private yacht journeys across emerald waters.',
      location: 'Amalfi Coast, Italy',
      eventDate: new Date('2025-09-12'),
      coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop',
      layoutMode: 'horizontal',
      featured: true,
      displayOrder: 2,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1600&auto=format&fit=crop', altText: 'Couple on Cliffside Overlooking Amalfi' },
        { imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1600&auto=format&fit=crop', altText: 'Sunset Boat Cruise' },
        { imageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1600&auto=format&fit=crop', altText: 'Vintage Italian Sports Car Shoot' },
      ],
    },
    {
      title: 'Sacred Heritage - Traditional Palace Rituals',
      slug: 'sacred-heritage-traditional-ceremony',
      categoryId: createdCategories['traditional-weddings'],
      description: 'Vibrant colors, rich silks, and sacred ceremonial emotions recorded with fine art reverence.',
      location: 'Udaipur Palace, India',
      eventDate: new Date('2025-11-10'),
      coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop',
      layoutMode: 'masonry',
      featured: true,
      displayOrder: 3,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1600&auto=format&fit=crop', altText: 'Traditional Silk Bride' },
        { imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop', altText: 'Palace Mandap Lights' },
      ],
    },
    {
      title: 'Symphony of Light - Fine Art Portraits',
      slug: 'symphony-of-shadows-portraits',
      categoryId: createdCategories['portraits'],
      description: 'A study of light, texture, and raw human emotion using medium format digital photography in studio daylight.',
      location: 'SoHo Studio, NYC',
      eventDate: new Date('2025-11-20'),
      coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop',
      layoutMode: 'filmstrip',
      featured: false,
      displayOrder: 4,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop', altText: 'Dramatic Portrait Studio Light' },
        { imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop', altText: 'Male Portrait in Natural Light' },
      ],
    },
  ];

  for (const proj of projectsData) {
    const project = await prisma.portfolioProject.upsert({
      where: {
        tenantId_slug: {
          tenantId: tenant.id,
          slug: proj.slug,
        },
      },
      update: {
        title: proj.title,
        categoryId: proj.categoryId,
        description: proj.description,
        location: proj.location,
        eventDate: proj.eventDate,
        coverImage: proj.coverImage,
        layoutMode: proj.layoutMode,
        featured: proj.featured,
        displayOrder: proj.displayOrder,
      },
      create: {
        tenantId: tenant.id,
        title: proj.title,
        slug: proj.slug,
        categoryId: proj.categoryId,
        description: proj.description,
        location: proj.location,
        eventDate: proj.eventDate,
        coverImage: proj.coverImage,
        layoutMode: proj.layoutMode,
        featured: proj.featured,
        displayOrder: proj.displayOrder,
        isPublished: true,
      },
    });

    await prisma.portfolioImage.deleteMany({
      where: { tenantId: tenant.id, projectId: project.id },
    });

    let imgOrder = 1;
    for (const img of proj.images) {
      await prisma.portfolioImage.create({
        data: {
          tenantId: tenant.id,
          projectId: project.id,
          imageUrl: img.imageUrl,
          altText: img.altText,
          displayOrder: imgOrder++,
        },
      });
    }
  }

  // 6. Services & Packages (Expanded Suite of 6 Luxury Packages)
  const servicesData = [
    {
      name: 'Royal Destination Wedding Experience',
      slug: 'royal-destination-wedding',
      description: 'Comprehensive 3-day coverage including welcome party, main wedding ceremony, drone imagery, second master shooter, and handcrafted leather heirloom album.',
      priceStarting: '$12,500',
      features: [
        'Full multi-day coverage (up to 24 total hours)',
        'Two Master Photographers + Lighting Assistant',
        '800+ High-Resolution Master Retouched Digital Images',
        'Private Online Cinematic Gallery with Print Rights',
        'Italian Handcrafted Leather Keepsake Album',
        'Drone & Aerial Architecture Photography',
      ],
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      displayOrder: 1,
    },
    {
      name: 'Editorial Couple & Engagement Story',
      slug: 'editorial-couple-story',
      description: 'Single day editorial photoshoot in romantic locations with wardrobe styling guidance and high-fashion portrait processing.',
      priceStarting: '$3,800',
      features: [
        'Up to 5 hours on-location photography',
        'Location scouting and concept moodboards',
        '150+ Signature Edited Digital Images',
        'High-resolution print release & web gallery',
        'Quick 72-hour sneak peek preview',
      ],
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
      displayOrder: 2,
    },
    {
      name: 'Traditional Ceremonial & Heritage Heritage',
      slug: 'traditional-heritage-ceremony',
      description: 'Multi-ceremony coverage designed for rich cultural rituals, sacred traditions, and vibrant family celebrations.',
      priceStarting: '$8,200',
      features: [
        'Full 2-day multi-ceremony coverage (up to 16 hours)',
        'Senior Master Photographer + Technical Assistant',
        '500+ High-Resolution Color Corrected Images',
        'Custom Fine Art Heritage Linen Album',
        'Same-day preview highlights reel',
      ],
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
      displayOrder: 3,
    },
    {
      name: 'Fine Art & Heirloom Studio Portraiture',
      slug: 'fine-art-heirloom-portraiture',
      description: 'Studio or daylight location session capturing timeless individual, maternity, family, or personal legacy portraits.',
      priceStarting: '$3,200',
      features: [
        'Up to 3 hours studio or on-location shoot',
        'Professional hair & makeup guidance',
        '40+ High-End Frequency Separation Retouched Images',
        'Museum-grade gallery canvas print included',
      ],
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      displayOrder: 4,
    },
    {
      name: 'Haute Fashion & Brand Campaign',
      slug: 'haute-fashion-campaign',
      description: 'High-end commercial and editorial imagery for fashion houses, luxury jewelry brands, and editorial publications.',
      priceStarting: '$6,800',
      features: [
        'Full Day Studio or On-Location Production',
        'Tethered Shooting for Client Approval',
        'Commercial Usage License included',
        'Advanced Skin & Garment Frequency Separation Retouching',
        'Dedicated Digital Tech on Set',
      ],
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
      displayOrder: 5,
    },
    {
      name: 'Luxury Gala, Red Carpet & VIP Summit',
      slug: 'luxury-gala-vip-summit',
      description: 'Exclusive coverage for high-profile red carpet galas, private estate anniversaries, and luxury corporate summits.',
      priceStarting: '$5,500',
      features: [
        'Up to 8 hours gala & reception coverage',
        'On-site photo wall & red carpet station',
        '300+ Retouched Digital Gallery Files',
        'Expedited 48-hour PR & Media Press Delivery',
      ],
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
      displayOrder: 6,
    },
  ];

  for (const srv of servicesData) {
    await prisma.service.upsert({
      where: {
        tenantId_slug: {
          tenantId: tenant.id,
          slug: srv.slug,
        },
      },
      update: srv,
      create: {
        tenantId: tenant.id,
        ...srv,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed script error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
