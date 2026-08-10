// Backend/src/services/Doctor/doctor.service.ts
import prisma from '../../lib/prisma.js';

interface GetAllDoctorsParams {
  page: number;
  limit: number;
  search?: string;
  department?: string;
}

export const getAllDoctors = async ({
  page,
  limit,
  search = '',
  department = '',
}: GetAllDoctorsParams) => {
  const skip = (page - 1) * limit;

  const whereCondition = {
    user: {
      isActive: true,
      isEmailVerified: true,
    },

    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
        {
          specialization: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
      ],
    }),

    ...(department && {
      department: {
        name: {
          equals: department,
          mode: 'insensitive' as const,
        },
      },
    }),
  };

  // Get paginated doctors
  const doctors = await prisma.doctorProfile.findMany({
    where: whereCondition,

    include: {
      user: {
        select: {
          id: true,
          email: true,
          profileImage: true,
          isEmailVerified: true,
          role: true,
        },
      },

      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },

    skip,
    take: limit,
  });

  // Get total count
  const total = await prisma.doctorProfile.count({
    where: whereCondition,
  });

  return {
    doctors,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
/**
 * Get Single Doctor
 */
export const getDoctorById = async (doctorId: string) => {
  console.log("CHECKING DOCTOR ID:", doctorId);

  const rawSchedules = await prisma.doctorSchedule.findMany({
    where: {
      doctorId,
    },
  });

  console.log(
    "RAW SCHEDULES FROM DATABASE:",
    JSON.stringify(rawSchedules, null, 2),
  );

  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      id: doctorId,
    },

    include: {
      user: {
        select: {
          email: true,
          profileImage: true,
          isEmailVerified: true,
          role: true,
        },
      },

      department: {
        select: {
          id: true,
          name: true,
        },
      },

      schedules: {
        orderBy: {
          dayOfWeek: "asc",
        },
        select: {
          id: true,
          dayOfWeek: true,
          startTime: true,
          endTime: true,
          isActive: true,
        },
      },
    },
  });

  if (!doctor) {
    throw new Error("Doctor not found.");
  }

  console.log(
    "DOCTOR RESULT:",
    JSON.stringify(doctor, null, 2),
  );

  return doctor;
};
/**
 * Doctor Dashboard
 */
export const getDashboard = async (userId: string) => {
  // Find doctor profile
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!doctor) {
    throw new Error("Doctor profile not found.");
  }

  // Today's date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  // Dashboard statistics
  const [
    todayAppointments,
    pendingAppointments,
    totalPatients,
    appointments,
    weeklyAppointments,
    earningsToday,
  ] = await Promise.all([
    // Today's appointments
    prisma.appointment.count({
      where: {
        doctorId: doctor.id,
        doctorArchived: false,

        appointmentAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),

    // Pending appointments
    prisma.appointment.count({
      where: {
        doctorId: doctor.id,
        doctorArchived: false,
        status: "PENDING",
      },
    }),

    // Total unique patients
    prisma.appointment.groupBy({
      by: ["patientId"],
      where: {
        doctorId: doctor.id,
        doctorArchived: false,
      },
    }),

    // Recent appointments
    prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        doctorArchived: false,
      },

      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },

      orderBy: {
        appointmentAt: "asc",
      },

      take: 10,
    }),

    // This week's appointments
    prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        doctorArchived: false,

        appointmentAt: {
          gte: today,
          lt: nextWeek,
        },
      },

      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },

      orderBy: {
        appointmentAt: "asc",
      },
    }),

    // Today's paid earnings
    prisma.payment.aggregate({
      where: {
        doctorId: doctor.id,
        status: "PAID",

        paidAt: {
          gte: today,
          lt: tomorrow,
        },
      },

      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    stats: {
      todayAppointments,
      totalPatients: totalPatients.length,
      pendingAppointments,

      // Total amount of PAID payments received today
      earningsToday: earningsToday._sum.amount ?? 0,
    },

    appointments,

    weeklyAppointments,

    recentPatients: appointments.map(
      (appointment) => appointment.patient,
    ),
  };
};

export const getMySchedule = async (userId: string) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      isAvailable: true,
      schedules: {
        orderBy: {
          dayOfWeek: "asc",
        },
      },
    },
  });

  if (!doctor) {
    throw new Error("Doctor profile not found.");
  }

  return doctor;
};

export const updateMySchedule = async (
  userId: string,
  schedules: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[],
) => {
  const doctor = await prisma.doctorProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!doctor) {
    throw new Error("Doctor profile not found.");
  }

  for (const schedule of schedules) {
    if (
      schedule.dayOfWeek < 0 ||
      schedule.dayOfWeek > 6
    ) {
      throw new Error("Invalid day of week.");
    }

    if (
      !/^\d{2}:\d{2}$/.test(schedule.startTime) ||
      !/^\d{2}:\d{2}$/.test(schedule.endTime)
    ) {
      throw new Error(
        "Time must be in HH:mm format.",
      );
    }

    if (
      schedule.isActive &&
      schedule.startTime >= schedule.endTime
    ) {
      throw new Error(
        "Start time must be earlier than end time.",
      );
    }
  }

  await prisma.$transaction(
    schedules.map((schedule) =>
      prisma.doctorSchedule.upsert({
        where: {
          doctorId_dayOfWeek: {
            doctorId: doctor.id,
            dayOfWeek: schedule.dayOfWeek,
          },
        },
        update: {
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isActive: schedule.isActive,
        },
        create: {
          doctorId: doctor.id,
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isActive: schedule.isActive,
        },
      }),
    ),
  );

  return getMySchedule(userId);
};

export const updateAvailability = async (
  userId: string,
  isAvailable: boolean,
) => {
  const doctor = await prisma.doctorProfile.update({
    where: {
      userId,
    },
    data: {
      isAvailable,
    },
    select: {
      id: true,
      isAvailable: true,
    },
  });

  return doctor;
};