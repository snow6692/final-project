import z from "zod";




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


export type imageSchema = z.infer<typeof imageSchema>;
export type outfitSchema = z.infer<typeof outfitSchema>;
