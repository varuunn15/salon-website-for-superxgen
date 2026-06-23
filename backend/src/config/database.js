import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('[Neon PostgreSQL] Database connected successfully.');
  } catch (error) {
    console.error('[Neon PostgreSQL] Connection failed:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('[Neon PostgreSQL] Disconnected through app termination');
  process.exit(0);
});

export default prisma;
