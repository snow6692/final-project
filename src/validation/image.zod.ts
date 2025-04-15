import { z } from "zod";

// Schema for creating an image
export const createImageSchema = z.object({
  categoryId: z
    .string({ message: "Category ID is required" })
    .uuid("Invalid category ID"),
});

// Schema for updating an image
export const updateImageSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID").optional(),
});

export type CreateImageInput = z.infer<typeof createImageSchema>;
export type UpdateImageInput = z.infer<typeof updateImageSchema>;
