import express from "express";
import { config } from "./config/config";
import imageRouter from "./routes/image";
import categoryRouter from "./routes/category";
import authRoutes from "./auth/auth.routes";
import { v2 as cloudinary } from "cloudinary";
import outfitRouter from "./routes/outfit";

const app = express();
cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_KEY,
  api_secret: config.CLOUDINARY_SECRET,
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/image", imageRouter);
app.use("/api/category", categoryRouter);
app.use("/api/outfit", outfitRouter);

const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
