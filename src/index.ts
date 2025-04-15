import express from "express";
import session from "express-session";
import { config } from "./config/config";
import imageRouter from "./routes/image";
import categoryRouter from "./routes/category.route";
import userRoute from "./routes/user.route";
import authRoutes from "./auth/auth.routes";
import { v2 as cloudinary } from "cloudinary";
import outfitRouter from "./routes/outfit";
import passport from "./auth/passport";
const app = express();
cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_KEY,
  api_secret: config.CLOUDINARY_SECRET,
});

app.use(express.json());

// Set up session middleware (required for Passport)
app.use(
  session({
    secret: config.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/image", imageRouter);
app.use("/api/category", categoryRouter);
// app.use("/api/outfit", outfitRouter);

const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
