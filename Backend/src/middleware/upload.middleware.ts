// Backend/src/middleware/upload.middleware.ts
import multer from "multer";


// Store file in memory
// Files are uploaded directly to Cloudinary.
const storage = multer.memoryStorage();

// Allow medical report images and PDF documents.
const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb,
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(
    new Error(
      "Only JPG, JPEG, PNG, WEBP images and PDF files are allowed.",
    ),
  );
};

// Multer Upload Middleware
export const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});