// Backend/src/controller/medical_record_controller/medicalRecord.controller.ts
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as medicalRecordService from "../../services/MedicalRecord/medicalRecord.service.js";


// Medical History
export const createMedicalHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const history =
      await medicalRecordService.createMedicalHistory(
        req.user.id,
        req.body,
      );

    return res.status(201).json({
      success: true,
      message: "Medical history created successfully.",
      data: history,
    });
  } catch (error) {
    return next(error);
  }
};


export const getMedicalHistories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const histories =
      await medicalRecordService.getMedicalHistories(
        req.user.id,
      );

    return res.status(200).json({
      success: true,
      message: "Medical histories fetched successfully.",
      data: histories,
    });
  } catch (error) {
    return next(error);
  }
};


export const updateMedicalHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const historyId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!historyId) {
      return res.status(400).json({
        success: false,
        message: "Medical history ID is required.",
      });
    }

    const history =
      await medicalRecordService.updateMedicalHistory(
        req.user.id,
        historyId,
        req.body,
      );

    return res.status(200).json({
      success: true,
      message: "Medical history updated successfully.",
      data: history,
    });
  } catch (error) {
    return next(error);
  }
};


export const deleteMedicalHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const historyId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!historyId) {
      return res.status(400).json({
        success: false,
        message: "Medical history ID is required.",
      });
    }

    await medicalRecordService.deleteMedicalHistory(
      req.user.id,
      historyId,
    );

    return res.status(200).json({
      success: true,
      message: "Medical history deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};



// Medical Reports
export const uploadMedicalReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Medical report file is required.",
      });
    }

    const report =
      await medicalRecordService.uploadMedicalReport(
        req.user.id,
        req.file,
        req.body,
      );

    return res.status(201).json({
      success: true,
      message: "Medical report uploaded successfully.",
      data: report,
    });
  } catch (error) {
    return next(error);
  }
};


export const getMedicalReports = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const reports =
      await medicalRecordService.getMedicalReports(
        req.user.id,
      );

    return res.status(200).json({
      success: true,
      message: "Medical reports fetched successfully.",
      data: reports,
    });
  } catch (error) {
    return next(error);
  }
};


export const deleteMedicalReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const reportId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!reportId) {
      return res.status(400).json({
        success: false,
        message: "Medical report ID is required.",
      });
    }

    await medicalRecordService.deleteMedicalReport(
      req.user.id,
      reportId,
    );

    return res.status(200).json({
      success: true,
      message: "Medical report deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};



// All Medical Records
export const getMyMedicalRecords = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const records =
      await medicalRecordService.getPatientMedicalRecords(
        req.user.id,
      );

    return res.status(200).json({
      success: true,
      message: "Medical records fetched successfully.",
      data: records,
    });
  } catch (error) {
    return next(error);
  }
};