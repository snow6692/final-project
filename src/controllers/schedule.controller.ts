import { Response } from "express";
import {
  createScheduleSchema,
  updateScheduleSchema,
  CreateScheduleInput,
  UpdateScheduleInput,
} from "../validation/schedule.zod";
import prisma from "../config/prisma";
import { userTypes } from "../types/user.types";
import { CustomRequest } from "../types/express";

export const createSchedule = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user as userTypes;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const parsedData = await createScheduleSchema.safeParseAsync(req.body);
    if (!parsedData.success) {
      return res.status(422).json({ errors: parsedData.error.format() });
    }

    const data: CreateScheduleInput = parsedData.data;
    const { outfitId, date } = data;
    const userId = user.id;

    // Validate outfit exists and belongs to the user
    const outfit = await prisma.outfit.findUnique({
      where: { id: outfitId },
    });
    if (!outfit) {
      return res.status(404).json({ error: "Outfit not found" });
    }
    if (outfit.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only schedule your own outfits" });
    }

    // Check if the date is already scheduled
    const existingSchedule = await prisma.schedule.findUnique({
      where: { userId_date: { userId, date: new Date(date) } },
    });
    if (existingSchedule) {
      return res.status(400).json({ error: "This date is already scheduled" });
    }

    // Create the schedule
    const schedule = await prisma.schedule.create({
      data: {
        date: new Date(date),
        userId,
        outfitId,
      },
      include: {
        outfit: { include: { images: { include: { Category: true } } } },
      },
    });

    return res.status(201).json(schedule);
  } catch (error) {
    console.error("Error creating schedule:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserSchedules = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user as userTypes;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const { year, month } = req.query;
    let whereClause: any = { userId: user.id };

    if (year && month) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0);
      whereClause.date = { gte: startDate, lte: endDate };
    } else if (year) {
      const startDate = new Date(Number(year), 0, 1);
      const endDate = new Date(Number(year), 11, 31);
      whereClause.date = { gte: startDate, lte: endDate };
    }

    const schedules = await prisma.schedule.findMany({
      where: whereClause,
      include: {
        outfit: { include: { images: { include: { Category: true } } } },
      },
      orderBy: { date: "asc" },
    });

    return res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateSchedule = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as userTypes;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const parsedData = await updateScheduleSchema.safeParseAsync(req.body);
    if (!parsedData.success) {
      return res.status(422).json({ errors: parsedData.error.format() });
    }

    const data: UpdateScheduleInput = parsedData.data;
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    if (schedule.userId !== user.id) {
      return res
        .status(403)
        .json({ error: "You can only modify your own schedules" });
    }

    // If updating outfitId, validate it
    if (data.outfitId) {
      const outfit = await prisma.outfit.findUnique({
        where: { id: data.outfitId },
      });
      if (!outfit) {
        return res.status(404).json({ error: "Outfit not found" });
      }
      if (outfit.userId !== user.id) {
        return res
          .status(403)
          .json({ error: "You can only schedule your own outfits" });
      }
    }

    // If updating date, check for conflicts
    if (data.date) {
      const existingSchedule = await prisma.schedule.findUnique({
        where: { userId_date: { userId: user.id, date: new Date(data.date) } },
      });
      if (existingSchedule && existingSchedule.id !== id) {
        return res
          .status(400)
          .json({ error: "This date is already scheduled" });
      }
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: {
        outfitId: data.outfitId,
        date: data.date ? new Date(data.date) : undefined,
      },
      include: {
        outfit: { include: { images: { include: { Category: true } } } },
      },
    });

    return res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error("Error updating schedule:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteSchedule = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Schedule ID is required" });
    }

    const user = req.user as userTypes;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const schedule = await prisma.schedule.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    if (schedule.userId !== user.id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own schedules" });
    }

    await prisma.schedule.delete({ where: { id } });

    return res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
