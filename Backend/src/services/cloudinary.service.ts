// Backend/src/services/cloudinary.service.ts

import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

import type { UploadApiResponse } from "cloudinary";


// Upload image to Cloudinary Used by profile image upload and other image-only uploads.
export const uploadImage = async (
  file: Express.Multer.File,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(
            new Error("Cloudinary image upload failed."),
          );
        }

        resolve(result);
      },
    );

    streamifier
      .createReadStream(file.buffer)
      .pipe(uploadStream);
  });
};

// Upload medical report file to Cloudinary.
export const uploadMedicalFile = async (
  file: Express.Multer.File,
  folder: string,
): Promise<UploadApiResponse> => {
  const resourceType =
    file.mimetype === "application/pdf"
      ? "raw"
      : "image";

  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(
              new Error("Cloudinary medical file upload failed."),
            );
          }

          resolve(result);
        },
      );

    streamifier
      .createReadStream(file.buffer)
      .pipe(uploadStream);
  });
};

// Delete an uploaded file from Cloudinary.
export const deleteImage = async (
  publicId: string,
  resourceType: "image" | "raw" = "image",
) => {
  if (!publicId) {
    return;
  }

  return cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: resourceType,
    },
  );
};