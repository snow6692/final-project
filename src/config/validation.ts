import z from "zod";

export const outfitSchema = z.object({
  userId: z.string({ message: "UserId is required" }).uuid("Invalid user ID"),
  images: z.array(z.string().uuid("Invalid image ID")),
  favorite: z.boolean().default(false),
});

export type outfitSchema = z.infer<typeof outfitSchema>;
