import type { PrescriptionResponse } from "../types/prescription.js";

export function prescriptionPdfTemplate(
  prescription: PrescriptionResponse,
): string {
  const patient = prescription.appointment?.patient;
  const doctor = prescription.appointment?.doctor;

  const doctorName =
    doctor?.name
      ?.replace(/^(?:Dr\.?\s*)+/i, "")
      .trim() || "Doctor";

  const doctorDisplayName = `Dr. ${doctorName}`;

  const prescriptionDisplayId = prescription.id
    ? parseInt(
        prescription.id.replace(/\D/g, "").slice(-6) || "0",
        10,
      )
        .toString()
        .padStart(6, "0")
    : "000000";

  const formatDate = (
     date: string | Date | null | undefined,
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
    date: string | Date | null | undefined,
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

  const escapeHtml = (value: unknown): string => {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

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
                    ${escapeHtml(medicine.medicineName)}
                  </div>

                  <div class="medicine-grid">

                    <div>
                      <div class="label">
                        Dosage
                      </div>
                      <div class="value">
                        ${escapeHtml(medicine.dosage)}
                      </div>
                    </div>

                    <div>
                      <div class="label">
                        Frequency
                      </div>
                      <div class="value">
                        ${escapeHtml(medicine.frequency)}
                      </div>
                    </div>

                    <div>
                      <div class="label">
                        Duration
                      </div>
                      <div class="value">
                        ${escapeHtml(medicine.duration)}
                      </div>
                    </div>

                  </div>

                  ${
                    medicine.instructions?.trim()
                      ? `
                        <div class="instructions">
                          <strong>Instructions:</strong>
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
                  <div class="test-name">
                    ${escapeHtml(test.testName)}
                  </div>

                  ${
                    test.instructions?.trim()
                      ? `
                        <div class="test-instructions">
                          ${escapeHtml(
                            test.instructions,
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

  return `
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
  background: #ffffff;
  color: #1f2937;
  font-family:
    Arial,
    Helvetica,
    sans-serif;
}

body {
  font-size: 13px;
  line-height: 1.55;
}

.document {
  width: 100%;
  max-width: 794px;
  margin: 0 auto;
  background: #ffffff;
}

.header {
  border-bottom: 3px solid #059669;
  padding: 0 0 22px 0;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
}

.brand {
  color: #047857;
  font-size: 27px;
  font-weight: 800;
  letter-spacing: 1px;
}

.subtitle {
  margin-top: 3px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
}

.tagline {
  margin-top: 9px;
  color: #9ca3af;
  font-size: 10px;
}

.prescription-title {
  text-align: right;
}

.prescription-title h1 {
  margin: 0;
  color: #111827;
  font-size: 23px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.meta {
  margin-top: 5px;
  color: #6b7280;
  font-size: 10px;
}

.meta strong {
  color: #374151;
}

.doctor-block {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
}

.doctor-label {
  color: #9ca3af;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.doctor-name {
  margin-top: 4px;
  color: #111827;
  font-size: 14px;
  font-weight: 700;
}

.doctor-profession {
  margin-top: 1px;
  color: #6b7280;
  font-size: 11px;
}

.patient-section {
  margin-top: 22px;
  padding: 16px 18px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafafa;
}

.patient-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 14px 30px;
}

.info-label {
  color: #9ca3af;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.info-value {
  margin-top: 3px;
  color: #111827;
  font-size: 12px;
  font-weight: 700;
}

.section {
  margin-top: 25px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 9px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.section-marker {
  width: 4px;
  height: 18px;
  border-radius: 3px;
  background: #059669;
}

.section-title {
  color: #111827;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
}

.diagnosis {
  margin-top: 11px;
  padding-left: 12px;
  border-left: 2px solid #93c5fd;
  color: #374151;
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-line;
}

.medicine {
  display: flex;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid #f3f4f6;
  page-break-inside: avoid;
}

.medicine-number {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #059669;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
}

.medicine-content {
  flex: 1;
  min-width: 0;
}

.medicine-name {
  color: #111827;
  font-size: 13px;
  font-weight: 800;
}

.medicine-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 15px;
  margin-top: 8px;
}

.label {
  color: #9ca3af;
  font-size: 9px;
}

.value {
  margin-top: 2px;
  color: #374151;
  font-size: 11px;
  font-weight: 700;
}

.instructions {
  margin-top: 7px;
  color: #6b7280;
  font-size: 10px;
  line-height: 1.6;
}

.instructions strong {
  color: #4b5563;
}

.test {
  display: flex;
  gap: 9px;
  padding: 6px 0;
  page-break-inside: avoid;
}

.test-number {
  color: #7c3aed;
  font-weight: 800;
}

.test-name {
  color: #374151;
  font-size: 11px;
  font-weight: 700;
}

.test-instructions {
  margin-top: 2px;
  color: #6b7280;
  font-size: 10px;
}

.advice {
  margin-top: 11px;
  padding: 13px 15px;
  border-radius: 8px;
  background: #f9fafb;
  color: #374151;
  font-size: 11px;
  line-height: 1.7;
  white-space: pre-line;
}

.follow-up {
  margin-top: 15px;
  padding: 12px 15px;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  background: #fff7ed;
}

.follow-up-label {
  color: #ea580c;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.follow-up-date {
  margin-top: 3px;
  color: #374151;
  font-size: 11px;
  font-weight: 700;
}

.signature {
  margin-top: 45px;
  margin-left: auto;
  width: 190px;
  text-align: center;
}

.signature-line {
  padding-bottom: 6px;
  border-bottom: 1px solid #9ca3af;
}

.signature-name {
  color: #111827;
  font-size: 15px;
  font-weight: 700;
  font-style: italic;
}

.signature-doctor {
  margin-top: 7px;
  color: #111827;
  font-size: 11px;
  font-weight: 700;
}

.signature-profession {
  margin-top: 2px;
  color: #6b7280;
  font-size: 9px;
}

.signature-label {
  margin-top: 3px;
  color: #9ca3af;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.footer {
  margin-top: 35px;
  padding-top: 12px;
  border-top: 3px solid #059669;
  text-align: center;
}

.footer-main {
  color: #6b7280;
  font-size: 9px;
  font-weight: 600;
}

.footer-date {
  margin-top: 3px;
  color: #9ca3af;
  font-size: 8px;
}

.empty {
  margin-top: 10px;
  color: #9ca3af;
  font-size: 10px;
}

@page {
  size: A4;
  margin: 12mm;
}

</style>

</head>

<body>

<div class="document">

  <!-- HEADER -->

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
            ${formatDate(prescription.createdAt)}
          </strong>
        </div>

      </div>

    </div>

    <div class="doctor-block">

      <div class="doctor-label">
        Attending Physician
      </div>

      <div class="doctor-name">
        ${escapeHtml(doctorDisplayName)}
      </div>

      <div class="doctor-profession">
        Medical Practitioner
      </div>

    </div>

  </header>


  <!-- PATIENT INFORMATION -->

  <section class="patient-section">

    <div class="patient-grid">

      <div>

        <div class="info-label">
          Patient
        </div>

        <div class="info-value">
          ${escapeHtml(
            patient?.name ?? "Unknown Patient",
          )}
        </div>

      </div>

      <div>

        <div class="info-label">
          Appointment
        </div>

        <div class="info-value">
          ${formatDateTime(
            prescription.appointment?.appointmentAt,
          )}
        </div>

      </div>

      ${
        patient?.gender
          ? `
            <div>

              <div class="info-label">
                Gender
              </div>

              <div class="info-value">
                ${escapeHtml(patient.gender)}
              </div>

            </div>
          `
          : ""
      }

      ${
        patient?.phone
          ? `
            <div>

              <div class="info-label">
                Phone
              </div>

              <div class="info-value">
                ${escapeHtml(patient.phone)}
              </div>

            </div>
          `
          : ""
      }

    </div>

  </section>


  <!-- DIAGNOSIS -->

  <section class="section">

    <div class="section-header">

      <div class="section-marker"></div>

      <div class="section-title">
        Diagnosis
      </div>

    </div>

    <div class="diagnosis">
      ${escapeHtml(prescription.diagnosis)}
    </div>

  </section>


  <!-- MEDICINES -->

  <section class="section">

    <div class="section-header">

      <div class="section-marker"></div>

      <div class="section-title">
        Medicines
      </div>

    </div>

    <div>
      ${medicinesHtml}
    </div>

  </section>


  <!-- TESTS -->

  <section class="section">

    <div class="section-header">

      <div class="section-marker"></div>

      <div class="section-title">
        Investigations / Tests
      </div>

    </div>

    <div>
      ${testsHtml}
    </div>

  </section>


  <!-- MEDICAL ADVICE -->

  <section class="section">

    <div class="section-header">

      <div class="section-marker"></div>

      <div class="section-title">
        Medical Advice
      </div>

    </div>

    <div class="advice">
      ${
        prescription.advice?.trim()
          ? escapeHtml(prescription.advice)
          : "No additional advice provided."
      }
    </div>

  </section>


  ${
    prescription.followUpDate
      ? `
        <div class="follow-up">

          <div class="follow-up-label">
            Follow-up Appointment
          </div>

          <div class="follow-up-date">
            ${formatDate(
              prescription.followUpDate,
            )}
          </div>

        </div>
      `
      : ""
  }


  <!-- SIGNATURE -->

  <div class="signature">

    <div class="signature-line">

      <div class="signature-name">
        ${escapeHtml(
          doctorName.split(/\s+/)[0] ||
            "Doctor",
        )}
      </div>

    </div>

    <div class="signature-doctor">
      ${escapeHtml(doctorDisplayName)}
    </div>

    <div class="signature-profession">
      Medical Practitioner
    </div>

    <div class="signature-label">
      Authorized Signature
    </div>

  </div>


  <!-- FOOTER -->

  <footer class="footer">

    <div class="footer-main">
      This prescription was digitally issued through
      CarePlus Medical System.
    </div>

    <div class="footer-date">
      Generated on
      ${formatDateTime(prescription.createdAt)}
    </div>

  </footer>

</div>

</body>

</html>
`;
}