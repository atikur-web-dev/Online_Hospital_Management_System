// Backend/src/services/cloudinary.service.ts
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

import type { UploadApiResponse } from "cloudinary";

/**
 * Upload image to Cloudinary
 */
export const uploadImage = async (
  file: Express.Multer.File,
  folder: string
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
            new Error("Cloudinary upload failed.")
          );
        }

        resolve(result);
      }
    );

    streamifier
      .createReadStream(file.buffer)
      .pipe(uploadStream);
  });
};

/**
 * Delete image from Cloudinary
 */
export const deleteImage = async (
  publicId: string
) => {
  if (!publicId) {
    return;
  }

  return cloudinary.uploader.destroy(publicId);
};