// Backend/src/templates/prescriptionEmail.ts

export function prescriptionEmailTemplate({
  patientName,
  doctorName,
  prescriptionLink,
}: {
  patientName: string;
  doctorName: string;
  prescriptionLink: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>Medical Prescription - CarePlus</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f4f7f6;
    font-family:Arial,Helvetica,sans-serif;
    color:#374151;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="padding:40px 15px;"
>
  <tr>
    <td align="center">

      <!-- Main Card -->
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
          max-width:600px;
          background:#ffffff;
          border-radius:20px;
          overflow:hidden;
          box-shadow:0 8px 30px rgba(0,0,0,0.08);
        "
      >

        <!-- Header -->
        <tr>
          <td
            style="
              background:#059669;
              padding:32px 30px;
              text-align:center;
            "
          >

            <div
              style="
                font-size:28px;
                font-weight:bold;
                color:#ffffff;
                letter-spacing:1px;
              "
            >
              CAREPLUS
            </div>

            <div
              style="
                margin-top:8px;
                font-size:14px;
                color:#d1fae5;
              "
            >
              Medical & Healthcare Center
            </div>

          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:38px 35px;">

            <p
              style="
                margin:0 0 18px;
                font-size:20px;
                font-weight:bold;
                color:#064e3b;
              "
            >
              Dear ${patientName},
            </p>

            <p
              style="
                margin:0;
                font-size:15px;
                line-height:1.8;
                color:#4b5563;
              "
            >
              We are pleased to inform you that your medical
              prescription has been issued by
              <strong>Dr. ${doctorName}</strong>
              through the CarePlus Medical System.
            </p>

            <p
              style="
                margin:18px 0 0;
                font-size:15px;
                line-height:1.8;
                color:#4b5563;
              "
            >
              You can securely view your complete prescription
              by clicking the button below. The prescription
              includes your diagnosis, prescribed medicines,
              recommended tests, medical advice, and follow-up
              information, where applicable.
            </p>

            <!-- Prescription Card -->
            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                margin-top:28px;
                background:#ecfdf5;
                border:1px solid #a7f3d0;
                border-radius:14px;
              "
            >
              <tr>
                <td style="padding:22px;">

                  <p
                    style="
                      margin:0;
                      font-size:12px;
                      font-weight:bold;
                      text-transform:uppercase;
                      letter-spacing:1px;
                      color:#6b7280;
                    "
                  >
                    Medical Prescription
                  </p>

                  <p
                    style="
                      margin:8px 0 0;
                      font-size:16px;
                      font-weight:bold;
                      color:#065f46;
                    "
                  >
                    Issued by Dr. ${doctorName}
                  </p>

                  <p
                    style="
                      margin:8px 0 0;
                      font-size:13px;
                      line-height:1.6;
                      color:#6b7280;
                    "
                  >
                    Your prescription is securely available
                    through the CarePlus patient portal.
                  </p>

                </td>
              </tr>
            </table>

            <!-- Button -->
            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="margin-top:32px;"
            >
              <tr>
                <td align="center">

                  <a
                    href="${prescriptionLink}"
                    target="_blank"
                    style="
                      display:inline-block;
                      background:#059669;
                      color:#ffffff;
                      text-decoration:none;
                      padding:14px 30px;
                      border-radius:12px;
                      font-size:15px;
                      font-weight:bold;
                    "
                  >
                    View My Prescription
                  </a>

                </td>
              </tr>
            </table>

            <p
              style="
                margin:28px 0 0;
                font-size:13px;
                line-height:1.7;
                color:#6b7280;
              "
            >
              For your privacy and security, please do not
              share your prescription link with anyone else.
              The link will remain available for
              <strong>7 days</strong>.
            </p>

            <p
              style="
                margin:22px 0 0;
                font-size:14px;
                line-height:1.7;
                color:#4b5563;
              "
            >
              If you have any questions regarding your
              prescription or treatment, please contact your
              healthcare provider.
            </p>

            <p
              style="
                margin:28px 0 0;
                font-size:14px;
                line-height:1.7;
                color:#4b5563;
              "
            >
              Thank you for choosing
              <strong>CarePlus Medical System.</strong>
            </p>

            <p
              style="
                margin:18px 0 0;
                font-size:14px;
                line-height:1.7;
                color:#4b5563;
              "
            >
              Best regards,<br />
              <strong>CarePlus Medical Team</strong>
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td
            style="
              border-top:1px solid #e5e7eb;
              padding:20px 30px;
              text-align:center;
            "
          >

            <p
              style="
                margin:0;
                font-size:12px;
                color:#9ca3af;
              "
            >
              This email was sent by CarePlus Medical System.
            </p>

            <p
              style="
                margin:6px 0 0;
                font-size:11px;
                color:#d1d5db;
              "
            >
              Please do not reply to this automated email.
            </p>

          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
`;
}