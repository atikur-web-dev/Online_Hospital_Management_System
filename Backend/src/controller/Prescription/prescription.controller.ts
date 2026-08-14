// Backend/src/controller/Prescription/prescription.controller.ts
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { generatePrescriptionPdf } from "../../services/Prescription/prescriptionPdf.service.js";
import prisma from '../../lib/prisma.js';
import { env } from '../../config/env.js';

import { sendPrescriptionToPatient } from '../../services/Prescription/prescriptionEmail.service.js';

// ============================================================
// Send Prescription Email
// ============================================================

export const sendPrescriptionEmailController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { prescriptionId } = req.params;

    if (!prescriptionId || Array.isArray(prescriptionId)) {
      return res.status(400).json({
        success: false,
        message: 'Prescription ID is required',
      });
    }

    const message = await sendPrescriptionToPatient(prescriptionId);

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('SEND PRESCRIPTION EMAIL ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to send prescription to patient',
    });
  }
};

// ============================================================
// Public Prescription View
// ============================================================

export const getPublicPrescription = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // --------------------------------------------------------
    // Validate token parameter
    // --------------------------------------------------------

    if (!token || Array.isArray(token)) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Invalid Prescription Link</title>
          </head>
          <body
            style="
              margin:0;
              min-height:100vh;
              display:flex;
              align-items:center;
              justify-content:center;
              background:#f3f4f6;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            <div
              style="
                max-width:500px;
                margin:20px;
                padding:40px;
                background:white;
                border-radius:16px;
                text-align:center;
                box-shadow:0 10px 30px rgba(0,0,0,.08);
              "
            >
              <h1 style="color:#dc2626;">
                Invalid Prescription Link
              </h1>

              <p style="color:#6b7280;">
                The prescription link is missing or invalid.
              </p>
            </div>
          </body>
        </html>
      `);
    }

    // --------------------------------------------------------
    // Verify prescription JWT
    // --------------------------------------------------------

    let decoded: {
      prescriptionId: string;
    };

    try {
      decoded = jwt.verify(token, env.PRESCRIPTION_VIEW_SECRET) as {
        prescriptionId: string;
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <title>Prescription Link Expired</title>
            </head>

            <body
              style="
                margin:0;
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                background:#f3f4f6;
                font-family:Arial,Helvetica,sans-serif;
              "
            >
              <div
                style="
                  max-width:500px;
                  margin:20px;
                  padding:40px;
                  background:#ffffff;
                  border-radius:16px;
                  text-align:center;
                  box-shadow:0 10px 30px rgba(0,0,0,.08);
                "
              >
                <h1 style="color:#d97706;">
                  Prescription Link Expired
                </h1>

                <p style="color:#6b7280;line-height:1.7;">
                  This prescription link is no longer valid.
                  Please contact your healthcare provider
                  if you need another copy.
                </p>
              </div>
            </body>
          </html>
        `);
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <title>Invalid Prescription Link</title>
            </head>

            <body
              style="
                margin:0;
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                background:#f3f4f6;
                font-family:Arial,Helvetica,sans-serif;
              "
            >
              <div
                style="
                  max-width:500px;
                  margin:20px;
                  padding:40px;
                  background:#ffffff;
                  border-radius:16px;
                  text-align:center;
                  box-shadow:0 10px 30px rgba(0,0,0,.08);
                "
              >
                <h1 style="color:#dc2626;">
                  Invalid Prescription Link
                </h1>

                <p style="color:#6b7280;line-height:1.7;">
                  This prescription link is invalid or
                  has been modified.
                </p>
              </div>
            </body>
          </html>
        `);
      }

      throw error;
    }

    // --------------------------------------------------------
    // Validate decoded payload
    // --------------------------------------------------------

    if (!decoded?.prescriptionId) {
      return res.status(401).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Invalid Prescription Link</title>
          </head>

          <body
            style="
              margin:0;
              min-height:100vh;
              display:flex;
              align-items:center;
              justify-content:center;
              background:#f3f4f6;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            <div
              style="
                max-width:500px;
                margin:20px;
                padding:40px;
                background:#ffffff;
                border-radius:16px;
                text-align:center;
              "
            >
              <h1 style="color:#dc2626;">
                Invalid Prescription Link
              </h1>

              <p style="color:#6b7280;">
                The prescription information could not be verified.
              </p>
            </div>
          </body>
        </html>
      `);
    }

    // --------------------------------------------------------
    // Find prescription
    // --------------------------------------------------------

    const prescription = await prisma.prescription.findUnique({
      where: {
        id: decoded.prescriptionId,
      },

      include: {
        medicines: true,
        tests: true,

        appointment: {
          include: {
            patient: true,
            doctor: true,
          },
        },
      },
    });

    // --------------------------------------------------------
    // Prescription not found
    // --------------------------------------------------------

    if (!prescription) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Prescription Not Found</title>
          </head>

          <body
            style="
              margin:0;
              min-height:100vh;
              display:flex;
              align-items:center;
              justify-content:center;
              background:#f3f4f6;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            <div
              style="
                max-width:500px;
                margin:20px;
                padding:40px;
                background:#ffffff;
                border-radius:16px;
                text-align:center;
                box-shadow:0 10px 30px rgba(0,0,0,.08);
              "
            >
              <h1 style="color:#dc2626;">
                Prescription Not Found
              </h1>

              <p style="color:#6b7280;line-height:1.7;">
                We could not find the prescription associated
                with this link.
              </p>
            </div>
          </body>
        </html>
      `);
    }

    // --------------------------------------------------------
    // Data
    // --------------------------------------------------------

    const patient = prescription.appointment?.patient;

    const doctor = prescription.appointment?.doctor;

    const doctorName =
      doctor?.name?.replace(/^(?:Dr\.?\s*)+/i, '').trim() || 'Doctor';

    const doctorDisplayName = `Dr. ${doctorName}`;

    const patientName = patient?.name || 'Patient';

    const prescriptionId = prescription.id;

    // --------------------------------------------------------
    // Formatters
    // --------------------------------------------------------

    const formatDate = (value: Date | string | null | undefined) => {
      if (!value) return '--';

      return new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    };

    const formatDateTime = (value: Date | string | null | undefined) => {
      if (!value) return '--';

      return new Date(value).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    // --------------------------------------------------------
    // Prescription Display ID
    // --------------------------------------------------------

    const prescriptionDisplayId = prescriptionId
      ? parseInt(prescriptionId.replace(/\D/g, '').slice(-6) || '0', 10)
          .toString()
          .padStart(6, '0')
      : '000000';

    // --------------------------------------------------------
    // Download URL
    // --------------------------------------------------------

    const downloadUrl =
  `${env.SERVER_URL}/api/v1/prescriptions/public/${token}/download`;

    // --------------------------------------------------------
    // Medicines HTML
    // --------------------------------------------------------

    const medicinesHtml =
      prescription.medicines.length === 0
        ? `
          <div class="empty">
            No medicines prescribed.
          </div>
        `
        : prescription.medicines
            .map(
              (medicine, index) => `
                <div class="medicine">
                  <div class="medicine-number">
                    ${index + 1}
                  </div>

                  <div class="medicine-content">
                    <div class="medicine-name">
                      ${medicine.medicineName}
                    </div>

                    <div class="medicine-grid">
                      <div>
                        <span>Dosage</span>
                        <strong>
                          ${medicine.dosage}
                        </strong>
                      </div>

                      <div>
                        <span>Frequency</span>
                        <strong>
                          ${medicine.frequency}
                        </strong>
                      </div>

                      <div>
                        <span>Duration</span>
                        <strong>
                          ${medicine.duration}
                        </strong>
                      </div>
                    </div>

                    ${
                      medicine.instructions?.trim()
                        ? `
                          <div class="instructions">
                            <strong>
                              Instructions:
                            </strong>
                            ${medicine.instructions}
                          </div>
                        `
                        : ''
                    }
                  </div>
                </div>
              `,
            )
            .join('');

    // --------------------------------------------------------
    // Tests HTML
    // --------------------------------------------------------

    const testsHtml =
      prescription.tests.length === 0
        ? `
          <div class="empty">
            No investigations prescribed.
          </div>
        `
        : prescription.tests
            .map(
              (test, index) => `
                <div class="test">
                  <span class="test-number">
                    ${index + 1}.
                  </span>

                  <div>
                    <strong>
                      ${test.testName}
                    </strong>

                   <p>
  ${test.testName}
</p>
                  </div>
                </div>
              `,
            )
            .join('');

    // --------------------------------------------------------
    // Follow-up
    // --------------------------------------------------------

    const followUpHtml = prescription.followUpDate
      ? `
          <div class="follow-up">
            <div class="follow-up-label">
              Follow-up Appointment
            </div>

            <div class="follow-up-date">
              ${formatDate(prescription.followUpDate)}
            </div>
          </div>
        `
      : '';

    // --------------------------------------------------------
    // Standalone HTML Page
    // --------------------------------------------------------

    const html = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    CarePlus Prescription #${prescriptionDisplayId}
  </title>

  <style>
    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      background: #f3f4f6;
      color: #374151;
      font-family:
        Arial,
        Helvetica,
        sans-serif;
    }

    body {
      padding: 32px 18px 50px;
    }

    .toolbar {
      width: 900px;
      max-width: 100%;
      margin: 0 auto 18px;
      display: flex;
      justify-content: flex-end;
    }

    .download-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 20px;
      border: none;
      border-radius: 10px;
      background: #059669;
      color: white;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      box-shadow:
        0 5px 15px rgba(5,150,105,.20);
    }

    .download-button:hover {
      background: #047857;
    }

    .paper {
      width: 900px;
      max-width: 100%;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 14px;
      box-shadow:
        0 12px 40px rgba(0,0,0,.10);
      overflow: hidden;
    }

    .header {
      padding: 38px 48px 30px;
      border-bottom: 3px solid #059669;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      gap: 30px;
    }

    .brand {
      color: #047857;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .subtitle {
      margin-top: 6px;
      color: #6b7280;
      font-size: 13px;
      font-weight: 600;
    }

    .tagline {
      margin-top: 12px;
      color: #9ca3af;
      font-size: 11px;
    }

    .prescription-title {
      text-align: right;
      color: #1f2937;
      font-size: 24px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .meta {
      margin-top: 7px;
      color: #6b7280;
      font-size: 11px;
      text-align: right;
    }

    .meta strong {
      color: #374151;
    }

    .doctor {
      margin-top: 28px;
      padding-top: 18px;
      border-top: 1px solid #f3f4f6;
    }

    .label {
      color: #9ca3af;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .doctor-name {
      margin-top: 7px;
      color: #111827;
      font-size: 15px;
      font-weight: 700;
    }

    .doctor-role {
      margin-top: 4px;
      color: #6b7280;
      font-size: 12px;
    }

    .patient-section {
      padding: 24px 48px;
      border-bottom: 1px solid #e5e7eb;
    }

    .patient-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .field-value {
      margin-top: 6px;
      color: #111827;
      font-size: 13px;
      font-weight: 700;
    }

    .section {
      padding: 28px 48px 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #1f2937;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    .section-icon {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: #ecfdf5;
      color: #059669;
      font-size: 14px;
      font-weight: 800;
    }

    .diagnosis {
      margin-top: 14px;
      padding-left: 14px;
      border-left: 2px solid #93c5fd;
      color: #374151;
      font-size: 13px;
      line-height: 1.8;
      white-space: pre-line;
    }

    .medicine {
      display: flex;
      gap: 14px;
      padding: 17px 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .medicine-number {
      width: 27px;
      height: 27px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #059669;
      color: white;
      font-size: 11px;
      font-weight: 800;
    }

    .medicine-content {
      flex: 1;
      min-width: 0;
    }

    .medicine-name {
      color: #111827;
      font-size: 14px;
      font-weight: 700;
    }

    .medicine-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-top: 10px;
    }

    .medicine-grid span {
      display: block;
      color: #9ca3af;
      font-size: 10px;
    }

    .medicine-grid strong {
      display: block;
      margin-top: 3px;
      color: #374151;
      font-size: 12px;
    }

    .instructions {
      margin-top: 8px;
      color: #6b7280;
      font-size: 11px;
      line-height: 1.6;
    }

    .instructions strong {
      color: #4b5563;
    }

    .test {
      display: flex;
      gap: 10px;
      padding: 7px 0;
      color: #374151;
      font-size: 13px;
    }

    .test-number {
      color: #7c3aed;
      font-weight: 800;
    }

    .test p {
      margin: 5px 0 0;
      color: #6b7280;
      font-size: 11px;
      line-height: 1.5;
    }

    .advice {
      margin-top: 14px;
      padding: 16px 18px;
      border-radius: 10px;
      background: #f9fafb;
      color: #374151;
      font-size: 13px;
      line-height: 1.8;
      white-space: pre-line;
    }

    .follow-up {
      margin-top: 24px;
      padding: 15px 18px;
      border: 1px solid #fed7aa;
      border-radius: 10px;
      background: #fff7ed;
    }

    .follow-up-label {
      color: #ea580c;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.3px;
      text-transform: uppercase;
    }

    .follow-up-date {
      margin-top: 5px;
      color: #374151;
      font-size: 13px;
      font-weight: 700;
    }

    .signature {
      padding: 48px;
      text-align: right;
    }

    .signature-line {
      display: inline-block;
      min-width: 150px;
      padding-bottom: 7px;
      border-bottom: 1px solid #9ca3af;
      color: #1f2937;
      font-size: 17px;
      font-style: italic;
      font-weight: 700;
    }

    .signature-doctor {
      margin-top: 7px;
      color: #1f2937;
      font-size: 12px;
      font-weight: 700;
    }

    .signature-role {
      margin-top: 3px;
      color: #6b7280;
      font-size: 10px;
    }

    .signature-label {
      margin-top: 4px;
      color: #9ca3af;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .footer {
      padding: 17px 48px;
      border-top: 2px solid #059669;
      text-align: center;
    }

    .footer p {
      margin: 0;
      color: #6b7280;
      font-size: 10px;
    }

    .footer p + p {
      margin-top: 4px;
      color: #9ca3af;
      font-size: 9px;
    }

    .empty {
      padding: 14px 0;
      color: #9ca3af;
      font-size: 12px;
    }

    @media (max-width: 700px) {
      body {
        padding: 15px 8px 30px;
      }

      .header,
      .patient-section,
      .section {
        padding-left: 24px;
        padding-right: 24px;
      }

      .signature {
        padding: 35px 24px;
      }

      .footer {
        padding-left: 24px;
        padding-right: 24px;
      }

      .header-top {
        flex-direction: column;
      }

      .prescription-title,
      .meta {
        text-align: left;
      }

      .patient-grid {
        grid-template-columns: 1fr;
      }

      .medicine-grid {
        grid-template-columns: 1fr;
      }
    }

    @media print {
      body {
        padding: 0;
        background: white;
      }

      .toolbar {
        display: none;
      }

      .paper {
        width: 100%;
        max-width: none;
        border-radius: 0;
        box-shadow: none;
      }
    }
  </style>
</head>

<body>

  <!-- Download toolbar -->

  <div class="toolbar">
    <a
      class="download-button"
      href="${downloadUrl}"
    >
      Download Prescription
    </a>
  </div>

  <!-- Standalone prescription -->

  <main class="paper">

    <!-- Header -->

    <header class="header">

      <div class="header-top">

        <div>
          <div class="brand">
            CAREPLUS
          </div>

          <div class="subtitle">
            Medical & Healthcare Center
          </div>

          <div class="tagline">
            Quality healthcare with compassionate care
          </div>
        </div>

        <div>
          <div class="prescription-title">
            Prescription
          </div>

          <div class="meta">
            Prescription ID:
            <strong>
              #${prescriptionDisplayId}
            </strong>
          </div>

          <div class="meta">
            Date:
            <strong>
              ${formatDate(prescription.createdAt)}
            </strong>
          </div>
        </div>

      </div>

      <div class="doctor">

        <div class="label">
          Attending Physician
        </div>

        <div class="doctor-name">
          ${doctorDisplayName}
        </div>

        <div class="doctor-role">
          Medical Practitioner
        </div>

      </div>

    </header>

    <!-- Patient -->

    <section class="patient-section">

      <div class="patient-grid">

        <div>
          <div class="label">
            Patient
          </div>

          <div class="field-value">
            ${patientName}
          </div>
        </div>

        <div>
          <div class="label">
            Appointment
          </div>

          <div class="field-value">
            ${formatDateTime(prescription.appointment?.appointmentAt)}
          </div>
        </div>

        ${
          patient?.gender
            ? `
              <div>
                <div class="label">
                  Gender
                </div>

                <div class="field-value">
                  ${patient.gender}
                </div>
              </div>
            `
            : ''
        }

        ${
          patient?.phone
            ? `
              <div>
                <div class="label">
                  Phone
                </div>

                <div class="field-value">
                  ${patient.phone}
                </div>
              </div>
            `
            : ''
        }

      </div>

    </section>

    <!-- Diagnosis -->

    <section class="section">

      <div class="section-title">

        <div class="section-icon">
          D
        </div>

        Diagnosis

      </div>

      <div class="diagnosis">
        ${prescription.diagnosis}
      </div>

    </section>

    <!-- Medicines -->

    <section class="section">

      <div class="section-title">

        <div class="section-icon">
          Rx
        </div>

        Medicines

      </div>

      <div>
        ${medicinesHtml}
      </div>

    </section>

    <!-- Tests -->

    <section class="section">

      <div class="section-title">

        <div class="section-icon">
          T
        </div>

        Tests

      </div>

      <div>
        ${testsHtml}
      </div>

    </section>

    <!-- Medical Advice -->

    <section class="section">

      <div class="section-title">

        <div class="section-icon">
          A
        </div>

        Medical Advice

      </div>

      <div class="advice">
        ${
          prescription.advice?.trim()
            ? prescription.advice
            : 'No additional advice provided.'
        }
      </div>

      ${followUpHtml}

    </section>

    <!-- Signature -->

    <section class="signature">

      <div class="signature-line">
        ${doctorName.split(/\s+/)[0]}
      </div>

      <div class="signature-doctor">
        ${doctorDisplayName}
      </div>

      <div class="signature-role">
        Medical Practitioner
      </div>

      <div class="signature-label">
        Authorized Signature
      </div>

    </section>

    <!-- Footer -->

    <footer class="footer">

      <p>
        This prescription was digitally issued through
        CarePlus Medical System.
      </p>

      <p>
        Generated on
        ${formatDateTime(prescription.createdAt)}
      </p>

    </footer>

  </main>

</body>
</html>
`;

    // --------------------------------------------------------
    // Send standalone HTML
    // --------------------------------------------------------

    res.status(200);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

    return res.send(html);
  } catch (error) {
    console.error('PUBLIC PRESCRIPTION ERROR:', error);

    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Prescription Error</title>
        </head>

        <body
          style="
            margin:0;
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#f3f4f6;
            font-family:Arial,Helvetica,sans-serif;
          "
        >
          <div
            style="
              max-width:500px;
              margin:20px;
              padding:40px;
              background:white;
              border-radius:16px;
              text-align:center;
              box-shadow:0 10px 30px rgba(0,0,0,.08);
            "
          >
            <h1 style="color:#dc2626;">
              Failed to Load Prescription
            </h1>

            <p style="color:#6b7280;line-height:1.7;">
              Something went wrong while loading this
              prescription. Please try again later.
            </p>
          </div>
        </body>
      </html>
    `);
  }
};

export const downloadPublicPrescription = async (
  req: Request,
  res: Response,
) => {
  try {
    const { token } = req.params;

    // ============================================================
    // Validate token
    // ============================================================

    if (!token || Array.isArray(token)) {
      return res.status(400).json({
        success: false,
        message: "Prescription token is required",
      });
    }

    // ============================================================
    // Verify JWT
    // ============================================================

    let decoded: {
      prescriptionId: string;
    };

    try {
      decoded = jwt.verify(
        token,
        env.PRESCRIPTION_VIEW_SECRET,
      ) as {
        prescriptionId: string;
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: "Prescription link has expired",
        });
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          message: "Invalid prescription link",
        });
      }

      throw error;
    }

    // ============================================================
    // Validate payload
    // ============================================================

    if (!decoded?.prescriptionId) {
      return res.status(401).json({
        success: false,
        message: "Invalid prescription token",
      });
    }

    // ============================================================
    // Generate PDF
    // ============================================================

    const pdf = await generatePrescriptionPdf(
      decoded.prescriptionId,
    );

    // ============================================================
    // Download response
    // ============================================================

    res.setHeader(
      "Content-Type",
      "application/pdf",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="CarePlus-Prescription-${decoded.prescriptionId}.pdf"`,
    );

    res.setHeader(
      "Content-Length",
      pdf.length.toString(),
    );

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate",
    );

    return res.status(200).send(pdf);
  } catch (error) {
    console.error(
      "DOWNLOAD PUBLIC PRESCRIPTION ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate prescription PDF",
    });
  }
};