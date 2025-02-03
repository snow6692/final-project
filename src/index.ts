import express from "express";
import passport from "passport";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { config } from "./config/config";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import imageRouter from "./routes/image";

const app = express();

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

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/images", imageRouter);

const PORT = config.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
