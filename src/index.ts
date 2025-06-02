import express from "express";
import cors from "cors";
import session from "express-session";
import { config } from "./config/config";
import imageRoute from "./routes/image.route";
import categoryRoute from "./routes/category.route";
import userRoute from "./routes/user.route";
import authRoutes from "./auth/auth.routes";
import { v2 as cloudinary } from "cloudinary";
import outfitRouter from "./routes/outfit.route";
import schedulesRoute from "./routes/schedule.routes";
import passport from "./auth/passport";
const app = express();
cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_KEY,
  api_secret: config.CLOUDINARY_SECRET,
});

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies/session to be sent (needed for Passport)
  })
);
// Set up session middleware (required for Passport)
app.use(
  session({
    secret: config.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to false for development (HTTP); true for production (HTTPS)
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/image", imageRoute);
app.use("/api/outfit", outfitRouter);
app.use("/api/schedules", schedulesRoute);

const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
