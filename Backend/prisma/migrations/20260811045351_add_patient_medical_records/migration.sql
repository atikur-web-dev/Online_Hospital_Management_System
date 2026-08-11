-- CreateTable
CREATE TABLE "medical_histories" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "details" TEXT,
    "diagnosedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_reports" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "filePublicId" TEXT,
    "fileType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_medical_histories" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "medicalHistoryId" TEXT NOT NULL,

    CONSTRAINT "appointment_medical_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_medical_reports" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "medicalReportId" TEXT NOT NULL,

    CONSTRAINT "appointment_medical_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medical_histories_patientId_idx" ON "medical_histories"("patientId");

-- CreateIndex
CREATE INDEX "medical_reports_patientId_idx" ON "medical_reports"("patientId");

-- CreateIndex
CREATE INDEX "appointment_medical_histories_appointmentId_idx" ON "appointment_medical_histories"("appointmentId");

-- CreateIndex
CREATE INDEX "appointment_medical_histories_medicalHistoryId_idx" ON "appointment_medical_histories"("medicalHistoryId");

-- CreateIndex
CREATE UNIQUE INDEX "appointment_medical_histories_appointmentId_medicalHistoryI_key" ON "appointment_medical_histories"("appointmentId", "medicalHistoryId");

-- CreateIndex
CREATE INDEX "appointment_medical_reports_appointmentId_idx" ON "appointment_medical_reports"("appointmentId");

-- CreateIndex
CREATE INDEX "appointment_medical_reports_medicalReportId_idx" ON "appointment_medical_reports"("medicalReportId");

-- CreateIndex
CREATE UNIQUE INDEX "appointment_medical_reports_appointmentId_medicalReportId_key" ON "appointment_medical_reports"("appointmentId", "medicalReportId");

-- AddForeignKey
ALTER TABLE "medical_histories" ADD CONSTRAINT "medical_histories_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_medical_histories" ADD CONSTRAINT "appointment_medical_histories_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_medical_histories" ADD CONSTRAINT "appointment_medical_histories_medicalHistoryId_fkey" FOREIGN KEY ("medicalHistoryId") REFERENCES "medical_histories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_medical_reports" ADD CONSTRAINT "appointment_medical_reports_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_medical_reports" ADD CONSTRAINT "appointment_medical_reports_medicalReportId_fkey" FOREIGN KEY ("medicalReportId") REFERENCES "medical_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
