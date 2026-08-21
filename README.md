# Online Hospital Management System

A full-stack hospital management system that connects **Patients, Doctors, and Administrators** through a single web platform.

## Important Setup

Before running the project locally, copy the provided `.env.example` file to `.env` and configure the required environment variables.

- **Backend:** Copy `Backend/.env.example` → `Backend/.env`
- **Frontend:** Copy `Frontend/.env.example` → `Frontend/.env`

> **Important:** A valid **Resend API Key** must be configured in the Backend `.env` for email verification and prescription email notifications to work properly.

> Never commit your actual `.env` file or any private API keys, passwords, database credentials, or secrets to GitHub.

## What Can You Do?

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
- Send prescriptions to patients via email

### Admin

- Dashboard with system overview
- Manage patients and doctors
- Manage departments
- Monitor appointments and payments
- View registered users and account status

## Demo Note

For the easiest way to explore the Patient module, use Google Login. This allows you to access the patient-side features without depending on the email verification flow.

> Email-based features, including email verification and prescription email notifications, depend on the configured Resend service. These features may not be available in every environment, while the core hospital management functionality can still be explored normally.

## Demo Accounts

### Admin

**Email:** `atikuradmin@gmail.com`  

**Password:** `atikur123`

### Doctor

Two doctor accounts are available for testing:

**Doctor 1**

**Email:** `doctor1@example.com`  

**Password:** `doctor123`

**Doctor 2**

**Email:** `doctor2@example.com`  

**Password:** `doctor123`

> Additional doctor accounts and their credentials are available in the seeded database (`prisma/seed.ts`).

### Patient

You can either:

- Register a new patient account using email/password, or
- Continue with **Google Login**

> For manual registration, email verification is required before login.


## How to Explore

**New Visitor:**  

Browse doctors → choose a doctor → view profile & availability → register/login → book an appointment.

**Patient:**  

Login → Doctors → select doctor → choose date/time → optionally share medical records → confirm appointment → make payment.

**Doctor:**  

Login → Dashboard → manage schedule, appointments, patient records and prescriptions.

**Admin:**  

Login with the demo admin account → Dashboard → manage the hospital system.

## Test Payment

The project uses **SSLCommerz Sandbox** for appointment payments.

When testing the payment flow, use the following sandbox card details:

**Card Number:** `4111111111111111`  

**Expiry:** `12/26`  

**CVC:** `111`  

**Verification Code:** `111111`

> These credentials are for **sandbox/testing purposes only** and do not represent a real payment card.

## Email Notifications

The system uses **Resend** for sending transactional emails, including prescription notifications and email verification.

> **Note:** Emails may occasionally be delivered to the **Spam/Junk** folder depending on the recipient's email provider. If an expected email does not appear in the inbox, please check the Spam/Junk folder.

## Deployment Note

The frontend is deployed on **Vercel** and the backend is deployed on **Render**.

> Since the backend is hosted on a cloud service, the first request after a period of inactivity may take slightly longer due to **cold-start/server wake-up latency**. Subsequent requests should generally respond faster.

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS

**Backend:** Node.js, Express.js, TypeScript

**Database:** PostgreSQL, Prisma ORM

**Authentication:** JWT, Google OAuth, Email Verification

**Other:** Redis, Cloudinary, Resend, SSLCommerz