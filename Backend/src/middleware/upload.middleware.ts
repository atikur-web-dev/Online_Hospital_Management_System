// Backend/src/middleware/upload.middleware.ts
import multer from "multer";

/**
 * Store file in memory
 * (We upload directly to Cloudinary)
 */
const storage = multer.memoryStorage();

/**
 * Allow only image files
 */
const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (
    allowedMimeTypes.includes(file.mimetype)
  ) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Only JPG, JPEG, PNG and WEBP images are allowed."
    )
  );
};

/**
 * Multer Upload Middleware
 */
export const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});