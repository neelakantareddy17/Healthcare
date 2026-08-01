import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;

  // ---------------------------------------------------------------------
  // 1. Admin account
  // ---------------------------------------------------------------------
  const adminEmail = 'admin@healthcare.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: adminEmail,
        password: await bcrypt.hash('Admin@123', saltRounds),
        role: 'ADMIN',
        phone: '9999999999',
      },
    });
    console.log(`✅ Admin created -> email: ${adminEmail} / password: Admin@123`);
  } else {
    console.log('ℹ️  Admin already exists, skipping.');
  }

  // ---------------------------------------------------------------------
  // 2. Sample department
  // ---------------------------------------------------------------------
  const department = await prisma.department.upsert({
    where: { name: 'General Medicine' },
    update: {},
    create: {
      name: 'General Medicine',
      description: 'General physician consultations and checkups',
    },
  });
  console.log(`✅ Department ready -> ${department.name}`);

  // ---------------------------------------------------------------------
  // 3. Sample doctor account (normally created by an Admin via the API)
  // ---------------------------------------------------------------------
  const doctorEmail = 'doctor@healthcare.com';
  const existingDoctor = await prisma.user.findUnique({ where: { email: doctorEmail } });

  if (!existingDoctor) {
    await prisma.user.create({
      data: {
        name: 'Dr. Jane Smith',
        email: doctorEmail,
        password: await bcrypt.hash('Doctor@123', saltRounds),
        role: 'DOCTOR',
        phone: '8888888888',
        doctor: {
          create: {
            departmentId: department.id,
            specialization: 'General Physician',
            experienceYears: 8,
            consultationFee: 500,
            qualification: 'MBBS, MD',
          },
        },
      },
    });
    console.log(`✅ Doctor created -> email: ${doctorEmail} / password: Doctor@123`);
  } else {
    console.log('ℹ️  Sample doctor already exists, skipping.');
  }
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
