import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary"; // Cloudinary config import

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "outfit_images",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
  }),
});

const upload = multer({ storage });

export default upload;
