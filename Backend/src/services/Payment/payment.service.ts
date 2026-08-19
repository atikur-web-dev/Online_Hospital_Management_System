// Backend/src/services/Payment/payment.service.ts
import axios from 'axios';
import prisma from '../../lib/prisma.js';

const SSL_PAYMENT_API = process.env.SSL_PAYMENT_API!;
const SSL_VALIDATION_API = process.env.SSL_VALIDATION_API!;
const SSL_STORE_ID = process.env.SSL_STORE_ID!;
const SSL_STORE_PASSWORD = process.env.SSL_STORE_PASSWORD!;
const SSL_SUCCESS_BACKEND_URL = process.env.SSL_SUCCESS_BACKEND_URL!;
const SSL_FAIL_BACKEND_URL = process.env.SSL_FAIL_BACKEND_URL!;
const SSL_CANCEL_BACKEND_URL = process.env.SSL_CANCEL_BACKEND_URL!;
const SSL_IPN_URL = process.env.SSL_IPN_URL!;
const generateTransactionId = () => {
  return `CP-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
};

// Initialize SSLCommerz payment
export const initiatePayment = async (
  appointmentId: string,
  patientUserId: string,
) => {
  const patient = await prisma.patientProfile.findUnique({
    where: {
      userId: patientUserId,
    },
  });

  if (!patient) {
    throw new Error('Patient profile not found.');
  }

  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
    include: {
      doctor: true,
      patient: {
        include: {
          user: true,
        },
      },
      payment: true,
    },
  });

  if (!appointment) {
    throw new Error('Appointment not found.');
  }

  if (appointment.patientId !== patient.id) {
    throw new Error('Unauthorized.');
  }

  if (appointment.status === 'CANCELLED') {
    throw new Error('Cancelled appointment cannot be paid.');
  }

  if (appointment.payment?.status === 'PAID') {
    throw new Error('This appointment has already been paid.');
  }

  const amount = appointment.doctor.consultationFee;

  if (amount === null || amount === undefined || amount <= 0) {
    throw new Error('Doctor consultation fee is not configured.');
  }

  const transactionId = generateTransactionId();

// Create / reset pending payment
  const payment = appointment.payment
    ? await prisma.payment.update({
        where: {
          appointmentId,
        },
        data: {
          amount,
          transactionId,
          status: 'PENDING',
          paidAt: null,
        },
      })
    : await prisma.payment.create({
        data: {
          appointmentId,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          amount,
          currency: 'BDT',
          transactionId,
          status: 'PENDING',
        },
      });

  try {
    const payload = {
      store_id: SSL_STORE_ID,
      store_passwd: SSL_STORE_PASSWORD,

      total_amount: amount.toFixed(2),
      currency: 'BDT',

      tran_id: transactionId,

      success_url: SSL_SUCCESS_BACKEND_URL,
      fail_url: SSL_FAIL_BACKEND_URL,
      cancel_url: SSL_CANCEL_BACKEND_URL,
      ipn_url: SSL_IPN_URL,

      cus_name: appointment.patient.name,
      cus_email: appointment.patient.user.email,

      cus_add1: appointment.patient.address ?? 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1200',
      cus_country: 'Bangladesh',

      shipping_method: 'NO',
      product_name: 'Doctor Consultation',
      product_category: 'Medical Service',
      product_profile: 'general',

      value_a: appointment.id,
      value_b: payment.id,
    };

    const response = await axios.post(
      SSL_PAYMENT_API,
      new URLSearchParams(payload),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    if (response.data?.status !== 'SUCCESS') {
      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: 'FAILED',
        },
      });

      throw new Error(
        response.data?.failedreason ??
          'Failed to initialize SSLCommerz payment.',
      );
    }

    return {
      paymentId: payment.id,
      transactionId,
      gatewayPageURL: response.data.GatewayPageURL,
      sessionKey: response.data.sessionkey,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('SSLCommerz error:', error.response?.data ?? error.message);
    } else if (error instanceof Error) {
      console.error('Payment initialization error:', error.message);
    } else {
      console.error('Payment initialization error:', error);
    }

    throw error;
  }
};

// Validate successful SSLCommerz transaction
export const validatePayment = async (valId: string) => {
  const response = await axios.get(SSL_VALIDATION_API, {
    params: {
      val_id: valId,
      store_id: SSL_STORE_ID,
      store_passwd: SSL_STORE_PASSWORD,
      format: 'json',
    },
  });

  const data = response.data;

  if (data?.status !== 'VALID' && data?.status !== 'VALIDATED') {
    throw new Error('Payment validation failed.');
  }

  const transactionId = data.tran_id;

  const payment = await prisma.payment.findUnique({
    where: {
      transactionId,
    },
  });

  if (!payment) {
    throw new Error('Payment record not found.');
  }


  if (Number(data.amount) !== Number(payment.amount)) {
    throw new Error('Payment amount mismatch.');
  }

 
  if (payment.status === 'PAID') {
    return payment;
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    await tx.appointment.update({
      where: {
        id: payment.appointmentId,
      },
      data: {
        status: 'CONFIRMED',
      },
    });

    return updatedPayment;
  });

  return result;
};
