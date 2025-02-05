import express from "express";
import passport from "passport";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { config } from "./config/config";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import imageRouter from "./routes/image";
import categoryRouter from "./routes/category";
import { v2 as cloudinary } from "cloudinary";
import outfitRouter from "./routes/outfit";

const app = express();
cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_KEY,
  api_secret: config.CLOUDINARY_SECRET,
});

// const url = cloudinary.url("cld-sample-5", {
//   transformation: [
//     {
//       fetch_format: "auto",
//     },
//     {
//       quality: "auto",
//     },
//     {
//       width: 1200,
//       height: 1200,
//       crop: "fill",
//       gravity: "auto",
//     },
//   ],
// });
// console.log(url);
// Initialize pgSession store for express-session
const PgStore = pgSession(session);

app.use(express.json());

// Set up session middleware with pgSession store
app.use(
  session({
    store: new PgStore({
      conObject: {
        connectionString: process.env.DATABASE_URL, // Make sure to use the correct PostgreSQL connection string
      },
      tableName: "session", // Table where sessions will be stored
    }),
    secret: "my-session-secret", // Change to something more secure
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true in production with https
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/image", imageRouter);
app.use("/api/category", categoryRouter);
app.use("/api/outfit", outfitRouter);

const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
