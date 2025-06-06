import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary"; // Cloudinary config import

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: req.body.isProfileImage ? "profile_images" : "outfit_images", // Dynamically set folder
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
  }),
});

const upload = multer({ storage });

export default upload;
