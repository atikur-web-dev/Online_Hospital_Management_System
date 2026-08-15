// Backend/src/services/Admin/dashboard.service.ts
import prisma from "../../lib/prisma.js";

// ============================================================
// ADMIN DASHBOARD
// ============================================================

export const getDashboard = async () => {
  // ----------------------------------------------------------
  // DATE RANGES
  // ----------------------------------------------------------

  const now = new Date();

  // Today: 00:00 -> tomorrow 00:00
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // ----------------------------------------------------------
  // TODAY'S STATS
  // ----------------------------------------------------------

  const [
    todayAppointments,
    todayPatientGroups,
    activeDoctors,
    pendingAppointments,
    todayRevenue,
  ] = await Promise.all([
    // Today's appointments
    prisma.appointment.count({
      where: {
        appointmentAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),

    // Unique patients with appointments today
    prisma.appointment.groupBy({
      by: ["patientId"],
      where: {
        appointmentAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),

    // Active + verified doctors
    prisma.doctorProfile.count({
      where: {
        user: {
          role: "DOCTOR",
          isActive: true,
          isEmailVerified: true,
        },
      },
    }),

    // All pending appointments
    prisma.appointment.count({
      where: {
        status: "PENDING",
      },
    }),

    // Today's paid revenue
    prisma.payment.aggregate({
      where: {
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

  // ----------------------------------------------------------
  // LAST 7 DAYS APPOINTMENT TREND
  // ----------------------------------------------------------

  const appointmentTrend: {
    date: string;
    appointments: number;
  }[] = [];

  for (let i = 6; i >= 0; i--) {
    const start = new Date(today);
    start.setDate(today.getDate() - i);

    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const count = await prisma.appointment.count({
      where: {
        appointmentAt: {
          gte: start,
          lt: end,
        },
      },
    });

    appointmentTrend.push({
      date: start.toISOString().split("T")[0] ?? "",
      appointments: count,
    });
  }

  // ----------------------------------------------------------
  // LAST 6 MONTHS REVENUE + PATIENTS
  // ----------------------------------------------------------

  const monthlyStats: {
    month: string;
    revenue: number;
    patients: number;
  }[] = [];

  for (let i = 5; i >= 0; i--) {
    const start = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1,
    );

    const end = new Date(
      now.getFullYear(),
      now.getMonth() - i + 1,
      1,
    );

    // Monthly paid revenue
    const revenueResult =
      await prisma.payment.aggregate({
        where: {
          status: "PAID",
          paidAt: {
            gte: start,
            lt: end,
          },
        },
        _sum: {
          amount: true,
        },
      });

    // Unique patients who had appointments
    // during this month
    const patientGroups =
      await prisma.appointment.groupBy({
        by: ["patientId"],
        where: {
          appointmentAt: {
            gte: start,
            lt: end,
          },
        },
      });

    monthlyStats.push({
      month: `${start.getFullYear()}-${String(
        start.getMonth() + 1,
      ).padStart(2, "0")}`,

      revenue:
        revenueResult._sum.amount ?? 0,

      patients: patientGroups.length,
    });
  }

  // ----------------------------------------------------------
  // RETURN DASHBOARD DATA
  // ----------------------------------------------------------

  return {
    stats: {
      todayPatients: todayPatientGroups.length,

      todayAppointments,

      activeDoctors,

      pendingAppointments,

      todayRevenue:
        todayRevenue._sum.amount ?? 0,
    },

    appointmentTrend,

    monthlyStats,
  };
};