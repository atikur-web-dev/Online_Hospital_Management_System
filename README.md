# Online Hospital Management System

A full-stack hospital management system that connects Patients, Doctors, and Administrators through a single web platform.

##  What Can You Do?

### Patient
- Register with email/password or Google
- Login and manage profile
- Browse doctors and specializations
- Book doctor appointments
- Share medical history & reports with doctors
- View appointment history and status
- View prescriptions and medical records
- Make appointment payments

### Doctor
- Login and manage professional profile
- Set consultation fee and availability
- Create weekly schedules
- View and manage patient appointments
- View shared patient medical records
- Complete appointments
- Create and manage digital prescriptions

### Admin
- Dashboard with system overview
- Manage patients and doctors
- Manage departments
- Monitor appointments and payments
- View registered users and account status

##  Demo Accounts

### Admin
**Email:** `atikuradmin@gmail.com`  
**Password:** `atikur123`

### Doctor
Use any doctor account from the seeded database (`prisma/seed.ts`) and its corresponding password.

### Patient
You can either:
- Register a new patient account using email/password, or
- Continue with **Google Login**

> For manual registration, email verification is required before login.

##  How to Explore

**New visitor:** Browse doctors → choose a doctor → view profile & availability → register/login → book an appointment.

**Patient:** Login → Doctors → select doctor → choose date/time → optionally share medical records → confirm appointment.

**Doctor:** Login → Dashboard → manage schedule, appointments, patient records and prescriptions.

**Admin:** Login with the demo admin account → Dashboard → manage the hospital system.

##  Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS  
**Backend:** Node.js, Express.js, TypeScript  
**Database:** PostgreSQL, Prisma ORM  
**Authentication:** JWT, Google OAuth, Email Verification  
**Other:** Redis, Cloudinary, Resend, SSLCommerz

