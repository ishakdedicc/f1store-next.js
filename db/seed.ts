import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';

const prisma = new PrismaClient();

async function main() {
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Products
  const products = sampleData.products.map((product) => ({
    ...product,
    images: JSON.stringify(product.images),
  }));

  await prisma.product.createMany({
    data: products,
  });

  // Users 
  await prisma.user.createMany({
    data: sampleData.users,
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
