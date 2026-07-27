// Backend/src/types/express.d.ts

import 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: "PATIENT" | "DOCTOR" | "ADMIN";
      isEmailVerified: boolean;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};