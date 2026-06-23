import { PrismaClient } from '@prisma/client';
import { SALONS, CITIES, SERVICES_CATEGORIES } from '../../src/data/mockData.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding database...');

  // 1. Seed initial Admin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@aura.io' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@aura.io',
      password: hashedPassword,
      role: 'admin',
      preferences: ['hair', 'facial', 'spa', 'makeup'],
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // 2. Seed Demo User
  const demoHashedPassword = await bcrypt.hash('user123', salt);
  const user = await prisma.user.upsert({
    where: { email: 'user@aura.io' },
    update: {},
    create: {
      name: 'Rohan Deshmukh',
      email: 'user@aura.io',
      password: demoHashedPassword,
      role: 'user',
      preferences: ['hair', 'facial'],
      diagnostics: {
        faceShape: 'Oval',
        acne: 'None (Clean)',
        hairline: 'Normal Taper'
      }
    },
  });
  console.log(`Demo user created: ${user.email}`);

  // 3. Seed Salons, Stylists, Services, and Reviews
  for (const salonData of SALONS) {
    const { stylists, services, reviews, ...salonCore } = salonData;

    // Check if salon exists
    const existingSalon = await prisma.salon.findUnique({
      where: { id: salonCore.id }
    });

    let createdSalon;
    
    if (!existingSalon) {
      createdSalon = await prisma.salon.create({
        data: {
          id: salonCore.id,
          name: salonCore.name,
          city: salonCore.city,
          rating: salonCore.rating,
          reviewsCount: salonCore.reviewsCount,
          priceCategory: salonCore.priceCategory,
          trending: salonCore.trending,
          description: salonCore.description,
          address: salonCore.address,
          workingHours: salonCore.workingHours,
          imageTheme: salonCore.imageTheme,
        }
      });
      console.log(`Created salon: ${createdSalon.name}`);

      // Seed Stylists
      if (stylists && stylists.length > 0) {
        await prisma.stylist.createMany({
          data: stylists.map(stylist => ({
            id: stylist.id,
            name: stylist.name,
            specialty: stylist.specialty,
            rating: stylist.rating,
            salonId: createdSalon.id,
          }))
        });
      }

      // Seed Services
      if (services && services.length > 0) {
        await prisma.service.createMany({
          data: services.map(service => ({
            id: service.id,
            name: service.name,
            category: service.category,
            price: service.price,
            duration: service.duration,
            salonId: createdSalon.id,
          }))
        });
      }

      // Seed Reviews
      if (reviews && reviews.length > 0) {
        await prisma.review.createMany({
          data: reviews.map((review, index) => ({
            author: review.author,
            rating: review.rating,
            comment: review.comment,
            date: review.date,
            salonId: createdSalon.id,
            userId: user.id // Defaulting all seed reviews to the demo user for foreign key constraint
          }))
        });
      }
    } else {
      console.log(`Salon already exists, skipping: ${existingSalon.name}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
