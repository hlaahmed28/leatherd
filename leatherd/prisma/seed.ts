import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Settings
  const settings = await prisma.appSettings.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      storeName: 'LEATHERD',
      whatsappNumber: '+201000000000',
      address: 'Cairo, Egypt',
      shippingFeeStandard: 50,
      governorateShippingFees: { "Cairo": 50, "Giza": 60, "Alexandria": 80 },
      freeShippingThreshold: 1000,
      instagramUrl: 'https://instagram.com/leatherd',
      facebookUrl: 'https://facebook.com/leatherd',
      tiktokUrl: 'https://tiktok.com/@leatherd',
      announcementBar: 'Free shipping on orders over 1000 EGP',
      aboutText: 'Premium leather goods and pashminas.',
      heroImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80',
      logo: 'LEATHERD',
      categories: ['Pashmina', 'Leather', 'Accessories'],
      categoryCovers: { 'Pashmina': 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&q=80' }
    }
  });
  console.log(`Settings seeded.`);

  // 2. Products
  const productsData = [
    {
      name: 'Classic Cashmere Pashmina',
      price: 1200,
      compareAtPrice: 1500,
      stockQuantity: 50,
      colors: ['Black', 'Beige', 'Navy'],
      sizes: ['Standard'],
      season: 'Winter 2024',
      image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&q=80',
      images: ['https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&q=80'],
      description: 'Luxurious cashmere blend pashmina perfect for elegant evenings.',
      material: '70% Cashmere, 30% Silk',
      care: 'Dry clean only',
      origin: 'Made in Egypt',
      isBestseller: true,
      status: 'active',
      category: 'Pashmina'
    },
    {
      name: 'Premium Leather Tote',
      price: 3500,
      stockQuantity: 20,
      colors: ['Tan', 'Black'],
      sizes: ['One Size'],
      season: 'All Season',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80',
      images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80'],
      description: 'Handcrafted genuine leather tote bag with spacious interior.',
      material: '100% Genuine Leather',
      care: 'Wipe with damp cloth',
      origin: 'Made in Egypt',
      isBestseller: true,
      status: 'active',
      category: 'Leather'
    }
  ];

  for (const p of productsData) {
    await prisma.product.create({
      data: p
    });
  }
  console.log(`Products seeded.`);

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
