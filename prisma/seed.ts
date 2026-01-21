import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const saltRounds = 10;

  // Create ADMIN user
  const adminPasswordHash = await bcrypt.hash('Admin@123', saltRounds);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@local.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@local.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`Created ADMIN user: ${admin.email}`);

  // Create USER
  const userPasswordHash = await bcrypt.hash('User@123', saltRounds);
  const user = await prisma.user.upsert({
    where: { email: 'user@local.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@local.com',
      passwordHash: userPasswordHash,
      role: Role.USER,
    },
  });
  console.log(`Created USER: ${user.email}`);

  // Create some sample employees
  const employees = [
    {
      name: 'John Doe',
      email: 'john.doe@company.com',
      position: 'Software Engineer',
      active: true,
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      position: 'Product Manager',
      active: true,
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@company.com',
      position: 'Designer',
      active: false,
    },
  ];

  for (const employee of employees) {
    const created = await prisma.employee.upsert({
      where: { email: employee.email },
      update: {},
      create: employee,
    });
    console.log(`Created employee: ${created.name} (${created.position})`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
