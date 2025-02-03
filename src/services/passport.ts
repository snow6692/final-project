import passport from "passport";
import LocalStrategy from "passport-local";
import bcryptjs from "bcryptjs";
import prisma from "../utils/prisma";

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

//when the user sign in it allows to know what information should be allowed to stored in the session User id
passport.serializeUser((user: any, done) => {
  console.log("Serializing user: ", user.id);
  done(null, user.id); // Serialize the user ID (only user ID is stored in the session)
});
//called on every request after login in  reterives user information based on id from the session  without login in again and again
passport.deserializeUser(async (userId: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return done(new Error("User not found"));
    }
    console.log("Deserialized user: ", user);

    done(null, user);
  } catch (error) {
    done(error);
  }
});
