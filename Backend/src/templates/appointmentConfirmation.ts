export function appointmentConfirmationTemplate({
  patientName,
  doctorName,
  department,
  appointmentDate,
  appointmentTime,
  problem,
}: {
  patientName: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  problem?: string | null;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Appointment Confirmation</title>
</head>

<body style="margin:0;background:#f5f7fb;font-family:Arial,sans-serif">

<div style="max-width:650px;margin:40px auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.08)">

<div style="background:#059669;padding:28px;text-align:center">

<h1 style="margin:0;color:#fff">
CarePlus Hospital
</h1>

<p style="margin-top:10px;color:#d1fae5">
Appointment Confirmation
</p>

</div>

<div style="padding:35px">

<h2 style="margin-top:0;color:#064e3b">
Hello ${patientName},
</h2>

<p style="font-size:16px;color:#555;line-height:1.8">
Your appointment has been booked successfully.
</p>

<table
style="
width:100%;
margin-top:30px;
border-collapse:collapse;
">

<tr>
<td style="padding:12px;font-weight:bold">Doctor</td>
<td style="padding:12px">Dr. ${doctorName}</td>
</tr>

<tr style="background:#f9fafb">
<td style="padding:12px;font-weight:bold">Department</td>
<td style="padding:12px">${department}</td>
</tr>

<tr>
<td style="padding:12px;font-weight:bold">Date</td>
<td style="padding:12px">${appointmentDate}</td>
</tr>

<tr style="background:#f9fafb">
<td style="padding:12px;font-weight:bold">Time</td>
<td style="padding:12px">${appointmentTime}</td>
</tr>

<tr>
<td style="padding:12px;font-weight:bold">Status</td>
<td style="padding:12px">
<span style="
background:#fef3c7;
padding:6px 12px;
border-radius:999px;
font-weight:bold;
color:#92400e;
">
Pending
</span>
</td>
</tr>

<tr style="background:#f9fafb">
<td style="padding:12px;font-weight:bold">
Problem
</td>
<td style="padding:12px">
${problem || "Not Provided"}
</td>
</tr>

</table>

<p style="
margin-top:35px;
color:#666;
line-height:1.8;
">

Please arrive at least
<b>15 minutes earlier</b>
than your appointment time.

</p>

<div
style="
margin-top:40px;
padding:18px;
background:#ecfdf5;
border-radius:10px;
color:#065f46;
">

Thank you for choosing
<b>CarePlus Hospital.</b>

</div>

</div>

</div>

</body>
</html>
`;
}