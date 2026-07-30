// Backend/src/config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

console.log("Cloud:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Key:", process.env.CLOUDINARY_API_KEY);
console.log(
  "Secret:",
  process.env.CLOUDINARY_API_SECRET ? "FOUND" : "NOT FOUND"
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;