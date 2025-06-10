import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";

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
