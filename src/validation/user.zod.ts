import { z } from "zod";

export const userZod = z.object({
  name: z.string().min(1, "Name must be at least 1 character").optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  Gender: z.enum(["MALE", "FEMALE"]).optional(),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val))
    .optional(),
});

export type userZod = z.infer<typeof userZod>;

export const passwordZod = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export type passwordZod = z.infer<typeof passwordZod>;
