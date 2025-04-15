import { Prisma } from "@prisma/client";

export type userTypes = Prisma.UserGetPayload<{
  include: {
    images: true;
    notifications: true;
    outfits: true;
  };
}>;