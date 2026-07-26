// Backend/prisma/seed.ts
import prisma from "../src/lib/prisma.js";
import bcrypt from "bcryptjs";



interface AdminCredentials {
  email: string;
  password: string;
  name: string;
}

// interface AdminProfileData {
//   userId: string;
//   name: string;
//   phone: string;
//   permissions: string[];
// }

async function main(): Promise<void> {
  console.log('Starting seed...');

  // Fixed Admin Credentials
  const adminCredentials: AdminCredentials = {
    email: 'atikuradmin@gmail.com',
    password: 'atikur123',
    name: 'Atikur Admin',
  };
  
  const adminEmail = adminCredentials.email;
  const adminPassword = adminCredentials.password;
  const adminName = adminCredentials.name;

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin already exists, skipping...');
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create Admin User with Transaction
  const admin = await prisma.$transaction(async (tx) => {
    // 1. Create User
    const newUser = await tx.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        isEmailVerified: true,
        isActive: true,
      },
    });

    // 2. Create Admin Profile
    await tx.adminProfile.create({
      data: {
        userId: newUser.id,
        name: adminName,
        phone: '01700000000',
        permissions: [
          'MANAGE_USERS',
          'MANAGE_DOCTORS',
          'MANAGE_PATIENTS',
          'MANAGE_APPOINTMENTS',
          'MANAGE_PAYMENTS',
          'VIEW_ANALYTICS',
          'VIEW_AUDIT_LOGS',
          'MANAGE_DEPARTMENTS',
        ],
      },
    });

    return newUser;
  });

  console.log('Admin created successfully!');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log(`Admin ID: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });