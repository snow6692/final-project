import { z } from "zod";

export const createScheduleSchema = z.object({
  outfitId: z.string().uuid("Invalid outfit ID"),
  date: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date >= new Date();
    },
    { message: "Invalid date or date is in the past" }
  ),
});

export const updateScheduleSchema = z.object({
  outfitId: z.string().uuid("Invalid outfit ID").optional(),
  date: z
    .string()
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date >= new Date();
      },
      { message: "Invalid date or date is in the past" }
    )
    .optional(),
});

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
