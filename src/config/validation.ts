import z from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const imageSchema = z.object({
  categoryId: z
    .string({ message: "CategoryId is requires" })
    .uuid("Invalid category ID"),

  userId: z.string({ message: "UserId is required" }).uuid("Invalid user ID"),
});

export const outfitSchema = z.object({
  userId: z.string({ message: "UserId is required" }).uuid("Invalid user ID"),
  images: z.array(z.string().uuid("Invalid image ID")),
  favorite: z.boolean().default(false),
});

export type userSchema = z.infer<typeof userSchema>;
export type loginSchema = z.infer<typeof loginSchema>;
export type categorySchema = z.infer<typeof categorySchema>;
export type imageSchema = z.infer<typeof imageSchema>;
export type outfitSchema = z.infer<typeof outfitSchema>;
