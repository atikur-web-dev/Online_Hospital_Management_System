// Backend/prisma/seed.ts
import prisma from '../src/lib/prisma.js';
import bcrypt from 'bcryptjs';

interface AdminCredentials {
  email: string;
  password: string;
  name: string;
}

const doctors = [
  {
    name: 'Dr. Sarah Ahmed',
    email: 'doctor1@careplus.com',
    password: 'doctor123',
    phone: '01710000001',
    department: 'Cardiology',
    specialization: 'Cardiologist',
    qualification: 'MBBS, MD (Cardiology)',
    experience: 12,
    consultationFee: 1200,
  },
  {
    name: 'Dr. Michael Brown',
    email: 'doctor2@careplus.com',
    password: 'doctor123',
    phone: '01710000002',
    department: 'Neurology',
    specialization: 'Neurologist',
    qualification: 'MBBS, DM (Neurology)',
    experience: 10,
    consultationFee: 1500,
  },
  {
    name: 'Dr. Emily Watson',
    email: 'doctor3@careplus.com',
    password: 'doctor123',
    phone: '01710000003',
    department: 'Pediatrics',
    specialization: 'Pediatrician',
    qualification: 'MBBS, FCPS',
    experience: 9,
    consultationFee: 1000,
  },
  {
    name: 'Dr. David Lee',
    email: 'doctor4@careplus.com',
    password: 'doctor123',
    phone: '01710000004',
    department: 'Orthopedics',
    specialization: 'Orthopedic Surgeon',
    qualification: 'MBBS, MS (Orthopedics)',
    experience: 14,
    consultationFee: 1800,
  },
  {
    name: 'Dr. Lisa Chen',
    email: 'doctor5@careplus.com',
    password: 'doctor123',
    phone: '01710000005',
    department: 'Dermatology',
    specialization: 'Dermatologist',
    qualification: 'MBBS, DDV',
    experience: 8,
    consultationFee: 900,
  },
  {
    name: 'Dr. James Wilson',
    email: 'doctor6@careplus.com',
    password: 'doctor123',
    phone: '01710000006',
    department: 'ENT',
    specialization: 'ENT Specialist',
    qualification: 'MBBS, MS (ENT)',
    experience: 11,
    consultationFee: 1100,
  },
  {
    name: 'Dr. Sophia Khan',
    email: 'doctor7@careplus.com',
    password: 'doctor123',
    phone: '01710000007',
    department: 'Gynecology',
    specialization: 'Gynecologist',
    qualification: 'MBBS, FCPS (Gynecology)',
    experience: 13,
    consultationFee: 1300,
  },
  {
    name: 'Dr. Robert Kim',
    email: 'doctor8@careplus.com',
    password: 'doctor123',
    phone: '01710000008',
    department: 'Ophthalmology',
    specialization: 'Eye Specialist',
    qualification: 'MBBS, DO',
    experience: 9,
    consultationFee: 950,
  },
];

async function main(): Promise<void> {
  console.log('Starting seed...');
  // ==============================
  // Seed Departments
  // ==============================

  const departments = [
    {
      name: 'Cardiology',
      description: 'Heart and cardiovascular diseases',
    },
    {
      name: 'Neurology',
      description: 'Brain and nervous system',
    },
    {
      name: 'Orthopedics',
      description: 'Bones, joints and muscles',
    },
    {
      name: 'Pediatrics',
      description: 'Child healthcare',
    },
    {
      name: 'Dermatology',
      description: 'Skin related diseases',
    },
    {
      name: 'Gynecology',
      description: "Women's healthcare",
    },
    {
      name: 'ENT',
      description: 'Ear, Nose and Throat',
    },
    {
      name: 'Ophthalmology',
      description: 'Eye specialist',
    },
  ];

  for (const department of departments) {
    await prisma.department.upsert({
      where: {
        name: department.name,
      },
      update: {},
      create: department,
    });
  }

  console.log(' Departments Seeded');

  // ==============================
  // Seed Demo Doctors
  // ==============================

  for (const doctor of doctors) {
    // Check if doctor already exists
    const existingDoctor = await prisma.user.findUnique({
      where: {
        email: doctor.email,
      },
    });

    if (existingDoctor) {
      console.log(`${doctor.name} already exists, skipping...`);
      continue;
    }

    // Find Department
    const department = await prisma.department.findUnique({
      where: {
        name: doctor.department,
      },
    });

    if (!department) {
      console.log(
        `Department "${doctor.department}" not found. Skipping ${doctor.name}`,
      );
      continue;
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(doctor.password, 10);

    // Default Avatar
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      doctor.name,
    )}&background=10b981&color=fff`;

    // Create User + Doctor Profile
    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: doctor.email,
          password: hashedPassword,
          role: 'DOCTOR',
          isEmailVerified: true,
          isActive: true,
          profileImage: avatar,
        },
      });

      await tx.doctorProfile.create({
        data: {
          userId: newUser.id,
          name: doctor.name,
          phone: doctor.phone,
          departmentId: department.id,
          specialization: doctor.specialization,
          qualification: doctor.qualification,
          experience: doctor.experience,
          consultationFee: doctor.consultationFee,
          isAvailable: true,
        },
      });
    });

    console.log(` ${doctor.name} created successfully.`);
  }

  console.log('Demo Doctors Seeded Successfully.');
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
