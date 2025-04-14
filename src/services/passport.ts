import passport from "passport";
import LocalStrategy from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import bcryptjs from "bcryptjs";
import prisma from "../config/prisma";
import { config } from "../config/config";
import { access } from "fs";

//local
passport.use(
  new LocalStrategy.Strategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          return done(null, false, { message: " Incorrect Email or password" });
        }
        if (!user?.password) {
          throw new Error("Password is missing.");
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: " Incorrect Email or password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

//google

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            google_id: profile.id,
          },
        });

        if (user) {
          return done(null, user);
        }
        const email = profile.emails && profile.emails[0]?.value;
        if (!email) {
          return done(new Error("Email is missing from Google profile"));
        }
        const newUser = await prisma.user.create({
          data: {
            email,
            name: profile.displayName,
            google_id: profile.id,
            image: profile.photos ? profile.photos[0].value : null,
            is_verified: true,
          },
        });
        done(null, newUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

//when the user sign in it allows to know what information should be allowed to stored in the session User id
passport.serializeUser((user: any, done) => {
  console.log("Serializing user: ", user.id);
  done(null, user.id); // Serialize the user ID (only user ID is stored in the session)
});
//called on every request after login in  reterives user information based on id from the session  without login in again and again

passport.deserializeUser(async (userId: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return done(new Error("User not found"));
    }

    done(null, user); // `user` here is of type `User`
  } catch (error) {
    done(error);
  }
});
