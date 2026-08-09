// Frontend/src/api/payment.api.ts
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "http://localhost:5000/api/v1";

export const initiatePayment = async (appointmentId: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/payment/initiate/${appointmentId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );

  return response.data;
};