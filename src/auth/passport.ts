import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../config/prisma";
import { config } from "../config/config";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { email: profile.emails?.[0]?.value || "" },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0]?.value || "",
              name: profile.displayName || "",
              image: profile.photos?.[0]?.value || "",
              emailVerified: new Date(),
            },
          });
        }

        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: "google",
              providerAccountId: profile.id,
            },
          },
          update: {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: Math.floor(
              Date.now() / 1000 + (profile as any).expires_in
            ),
          },
          create: {
            userId: user.id,
            type: "oauth",
            provider: "google",
            providerAccountId: profile.id,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: Math.floor(
              Date.now() / 1000 + (profile as any).expires_in
            ),
          },
        });

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        images: true,
        notifications: true,
        outfits: true,
        sessions: true,
      },
    });
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

export default passport;
