// Frontend/src/types/doctor.types.ts
export interface Doctor {
  id: string;
  name: string;
  phone: string | null;
  specialization: string | null;
  qualification: string | null;
  experience: number | null;
  consultationFee: number | null;
  isAvailable: boolean;

  department?: {
    id: string;
    name: string;
  } | null;

  user: {
    email: string;
    profileImage: string | null;
  };
}