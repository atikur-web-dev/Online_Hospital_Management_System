// Backend/src/services/Prescription/prescriptionPdf.service.ts
import puppeteer from "puppeteer";

import prisma from "../../lib/prisma.js";

import { NotFoundError } from "../../utils/errors/httpErrors.js";

export async function generatePrescriptionPdf(
  prescriptionId: string,
): Promise<Buffer> {
  // ================= Find Prescription =================

  const prescription =
    await prisma.prescription.findUnique({
      where: {
        id: prescriptionId,
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

  if (!prescription) {
    throw new NotFoundError(
      {},
      "Prescription not found",
    );
  }

  // ================= Helpers =================

  const escapeHtml = (value: unknown): string => {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const formatDate = (
    date: Date | string | null | undefined,
  ): string => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  };

  const formatDateTime = (
    date: Date | string | null | undefined,
  ): string => {
    if (!date) return "--";

    return new Date(date).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  // ================= Names =================

  const patientName = escapeHtml(
    prescription.appointment.patient.name,
  );

  const rawDoctorName =
    prescription.appointment.doctor.name;

  const cleanDoctorName =
    rawDoctorName
      ?.replace(/^(?:Dr\.?\s*)+/i, "")
      .trim() || "Doctor";

  const doctorName =
    escapeHtml(cleanDoctorName);

  const doctorFirstName =
    escapeHtml(
      cleanDoctorName.split(/\s+/)[0] ||
        "Doctor",
    );

  // ================= Prescription ID =================

  const prescriptionDisplayId =
    prescription.id
      ? parseInt(
          prescription.id
            .replace(/\D/g, "")
            .slice(-6) || "0",
          10,
        )
          .toString()
          .padStart(6, "0")
      : "000000";

  // ================= Medicines =================

  const medicinesHtml =
    prescription.medicines.length === 0
      ? `
        <p class="empty">
          No medicines prescribed.
        </p>
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
                    ${escapeHtml(
                      medicine.medicineName,
                    )}
                  </div>

                  <div class="medicine-grid">
                    <div>
                      <span>Dosage</span>
                      <strong>
                        ${escapeHtml(
                          medicine.dosage,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Frequency</span>
                      <strong>
                        ${escapeHtml(
                          medicine.frequency,
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Duration</span>
                      <strong>
                        ${escapeHtml(
                          medicine.duration,
                        )}
                      </strong>
                    </div>
                  </div>

                  ${
                    medicine.instructions?.trim()
                      ? `
                        <div class="instructions">
                          <b>Instructions:</b>
                          ${escapeHtml(
                            medicine.instructions,
                          )}
                        </div>
                      `
                      : ""
                  }
                </div>
              </div>
            `,
          )
          .join("");

  // ================= Tests =================

  const testsHtml =
    prescription.tests.length === 0
      ? `
        <p class="empty">
          No investigations prescribed.
        </p>
      `
      : prescription.tests
          .map(
            (test, index) => `
              <div class="test">
                <div class="test-number">
                  ${index + 1}.
                </div>

                <div>
                  <div class="test-name">
                    ${escapeHtml(
                      test.testName,
                    )}
                  </div>
                </div>
              </div>
            `,
          )
          .join("");

  // ================= HTML =================

  const html = `
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8" />

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
  font-family:
    Arial,
    Helvetica,
    sans-serif;
  color: #374151;
}

body {
  padding: 30px;
}

.page {
  width: 100%;
  max-width: 794px;
  margin: 0 auto;
  background: #ffffff;
}

.header {
  padding: 34px 42px 28px;
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
  font-weight: 700;
  letter-spacing: 1px;
}

.subtitle {
  margin-top: 5px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
}

.tagline {
  margin-top: 14px;
  color: #9ca3af;
  font-size: 11px;
}

.prescription-title {
  text-align: right;
}

.prescription-title h1 {
  margin: 0;
  color: #1f2937;
  font-size: 23px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.meta {
  margin-top: 6px;
  color: #6b7280;
  font-size: 11px;
}

.meta strong {
  color: #374151;
}

.doctor {
  margin-top: 25px;
  padding-top: 17px;
  border-top: 1px solid #e5e7eb;
}

.label {
  color: #9ca3af;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.doctor-name {
  margin-top: 6px;
  color: #111827;
  font-size: 14px;
  font-weight: 700;
}

.doctor-role {
  margin-top: 3px;
  color: #6b7280;
  font-size: 11px;
}

.patient-section {
  padding: 22px 42px;
  border-bottom: 1px solid #e5e7eb;
}

.patient-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.info-value {
  margin-top: 5px;
  color: #111827;
  font-size: 12px;
  font-weight: 600;
}

.section {
  padding: 24px 42px 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1f2937;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.4px;
}

.section-icon {
  width: 27px;
  height: 27px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  background: #ecfdf5;
  color: #059669;
  font-size: 13px;
  font-weight: 700;
}

.diagnosis {
  margin-top: 12px;
  padding-left: 13px;
  border-left: 2px solid #93c5fd;
  color: #374151;
  font-size: 12px;
  line-height: 1.8;
  white-space: pre-line;
}

.medicine {
  display: flex;
  gap: 13px;
  padding: 13px 0;
  border-bottom: 1px solid #f3f4f6;
}

.medicine-number {
  width: 25px;
  height: 25px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #059669;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
}

.medicine-content {
  flex: 1;
}

.medicine-name {
  color: #111827;
  font-size: 12px;
  font-weight: 700;
}

.medicine-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 9px;
}

.medicine-grid span {
  display: block;
  color: #9ca3af;
  font-size: 9px;
}

.medicine-grid strong {
  display: block;
  margin-top: 3px;
  color: #374151;
  font-size: 10px;
}

.instructions {
  margin-top: 8px;
  color: #6b7280;
  font-size: 9px;
  line-height: 1.6;
}

.test {
  display: flex;
  gap: 9px;
  padding: 6px 0;
}

.test-number {
  color: #7c3aed;
  font-size: 11px;
  font-weight: 700;
}

.test-name {
  color: #374151;
  font-size: 11px;
  font-weight: 600;
}

.test-instructions {
  margin-top: 3px;
  color: #6b7280;
  font-size: 9px;
  line-height: 1.5;
}

.advice {
  margin-top: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  background: #f9fafb;
  color: #374151;
  font-size: 11px;
  line-height: 1.8;
  white-space: pre-line;
}

.follow-up {
  margin-top: 16px;
  padding: 12px 15px;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  background: #fff7ed;
}

.follow-up-date {
  margin-top: 5px;
  color: #374151;
  font-size: 11px;
  font-weight: 700;
}

.signature-section {
  padding: 45px 42px 35px;
  text-align: right;
}

.signature-line {
  display: inline-block;
  min-width: 140px;
  padding-bottom: 7px;
  border-bottom: 1px solid #9ca3af;
  color: #374151;
  font-size: 15px;
  font-style: italic;
  font-weight: 600;
}

.signature-name {
  margin-top: 7px;
  color: #1f2937;
  font-size: 11px;
  font-weight: 700;
}

.signature-role {
  margin-top: 3px;
  color: #6b7280;
  font-size: 9px;
}

.signature-label {
  margin-top: 3px;
  color: #9ca3af;
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer {
  padding: 15px 42px;
  border-top: 3px solid #059669;
  text-align: center;
}

.footer p {
  margin: 0;
  color: #6b7280;
  font-size: 9px;
}

.footer p + p {
  margin-top: 4px;
  color: #9ca3af;
  font-size: 8px;
}

.empty {
  color: #9ca3af;
  font-size: 10px;
}

</style>

</head>

<body>

<div class="page">

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

      <div class="prescription-title">

        <h1>
          Prescription
        </h1>

        <div class="meta">
          Prescription ID:
          <strong>
            #${prescriptionDisplayId}
          </strong>
        </div>

        <div class="meta">
          Date:
          <strong>
            ${formatDate(
              prescription.createdAt,
            )}
          </strong>
        </div>

      </div>

    </div>

    <div class="doctor">

      <div class="label">
        Attending Physician
      </div>

      <div class="doctor-name">
        Dr. ${doctorName}
      </div>

      <div class="doctor-role">
        Medical Practitioner
      </div>

    </div>

  </header>


  <section class="patient-section">

    <div class="patient-grid">

      <div>
        <div class="label">
          Patient
        </div>

        <div class="info-value">
          ${patientName}
        </div>
      </div>

      <div>
        <div class="label">
          Appointment
        </div>

        <div class="info-value">
          ${formatDateTime(
            prescription.appointment
              .appointmentAt,
          )}
        </div>
      </div>

      ${
        prescription.appointment.patient
          .gender
          ? `
            <div>
              <div class="label">
                Gender
              </div>

              <div class="info-value">
                ${escapeHtml(
                  prescription.appointment
                    .patient.gender,
                )}
              </div>
            </div>
          `
          : ""
      }

      ${
        prescription.appointment.patient
          .phone
          ? `
            <div>
              <div class="label">
                Phone
              </div>

              <div class="info-value">
                ${escapeHtml(
                  prescription.appointment
                    .patient.phone,
                )}
              </div>
            </div>
          `
          : ""
      }

    </div>

  </section>


  <section class="section">

    <div class="section-title">

      <div class="section-icon">
        D
      </div>

      Diagnosis

    </div>

    <div class="diagnosis">
      ${escapeHtml(
        prescription.diagnosis,
      )}
    </div>

  </section>


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
          ? escapeHtml(
              prescription.advice,
            )
          : "No additional advice provided."
      }
    </div>

  </section>


  ${
    prescription.followUpDate
      ? `
        <section class="section">

          <div class="follow-up">

            <div class="label">
              Follow-up Appointment
            </div>

            <div class="follow-up-date">
              ${formatDate(
                prescription.followUpDate,
              )}
            </div>

          </div>

        </section>
      `
      : ""
  }


  <section class="signature-section">

    <div class="signature-line">
      ${doctorFirstName}
    </div>

    <div class="signature-name">
      Dr. ${doctorName}
    </div>

    <div class="signature-role">
      Medical Practitioner
    </div>

    <div class="signature-label">
      Authorized Signature
    </div>

  </section>


  <footer class="footer">

    <p>
      This prescription was digitally issued
      through CarePlus Medical System.
    </p>

    <p>
      Generated on
      ${formatDateTime(
        prescription.createdAt,
      )}
    </p>

  </footer>

</div>

</body>

</html>
`;

  // ================= Launch Chrome =================

  const browser = await puppeteer.launch({
    headless: true,

    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",

    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load",
    });

    const pdf = await page.pdf({
      format: "A4",

      printBackground: true,

      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },

      preferCSSPageSize: true,
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}