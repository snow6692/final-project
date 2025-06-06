import { Prisma } from '@prisma/client';
import prisma from "../config/prisma";

export type userTypes = Prisma.UserGetPayload<{
  include: {
    images: true;
    notifications: true;
    outfits: true;
  };
}>;

const getCurrentUserTypes = async () => {
  return await prisma.user.findFirst({
    include: {
      images: true,
      notifications: true,
      outfits: true,
    },
  });
};

export type UserTypeClient = Awaited<ReturnType<typeof getCurrentUserTypes>>;
