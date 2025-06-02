// import { z } from "zod";

// export const createScheduleSchema = z.object({
//   outfitId: z.string().uuid("Invalid outfit ID"),
//   date: z.string().refine(
//     (val) => {
//       const date = new Date(val);
//       return !isNaN(date.getTime()) && date >= new Date();
//     },
//     { message: "Invalid date or date is in the past" }
//   ),
// });

// export const updateScheduleSchema = z.object({
//   outfitId: z.string().uuid("Invalid outfit ID").optional(),
//   date: z
//     .string()
//     .refine(
//       (val) => {
//         const date = new Date(val);
//         return !isNaN(date.getTime()) && date >= new Date();
//       },
//       { message: "Invalid date or date is in the past" }
//     )
//     .optional(),
// });

// export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
// export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;

import { z } from "zod";

export const createScheduleSchema = z.object({
  outfitId: z.string().uuid("Invalid outfit ID"),
  date: z.string().refine(
    (val) => {
      console.log("Backend parsing date:", val);
      const date = new Date(val);
      const normalizedDate = new Date(date.setUTCHours(0, 0, 0, 0));
      const now = new Date(new Date().setUTCHours(0, 0, 0, 0));
      console.log(
        "Parsed date:",
        normalizedDate,
        "Now:",
        now,
        "Is valid:",
        !isNaN(date.getTime()),
        "Is future or today:",
        normalizedDate >= now
      );
      return !isNaN(date.getTime()) && normalizedDate >= now;
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
        console.log("Backend parsing update date:", val);
        const date = new Date(val);
        const normalizedDate = new Date(date.setUTCHours(0, 0, 0, 0));
        const now = new Date(new Date().setUTCHours(0, 0, 0, 0));
        console.log(
          "Parsed update date:",
          normalizedDate,
          "Now:",
          now,
          "Is valid:",
          !isNaN(date.getTime()),
          "Is future or today:",
          normalizedDate >= now
        );
        return !isNaN(date.getTime()) && normalizedDate >= now;
      },
      { message: "Invalid date or date is in the past" }
    )
    .optional(),
});

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
