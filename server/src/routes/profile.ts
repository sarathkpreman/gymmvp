import { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma";

export const profileRouter = Router();

profileRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, ...profileData } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "UserID is required" });
    }

    const {
      goal,
      experience,
      daysPerWeek,
      sessionLength,
      equipment,
      injuries,
      preferedSplit
    } = profileData;

    if (!goal || !experience || !daysPerWeek || !sessionLength || !equipment || !preferedSplit) {
      return res.status(400).json({ error: "Missing required field" });
    }

    await prisma.userProfile.upsert({
      where: { user_id: userId },
      update: {
        goal,
        experience,
        days_per_week: daysPerWeek,
        session_length: sessionLength,
        equipment,
        injuries: injuries || null,
        prefered_split: preferedSplit,
        updated_at: new Date(),
      },
      create: {
        user_id: userId,
        goal,
        experience,
        days_per_week: daysPerWeek,
        session_length: sessionLength,
        equipment,
        injuries: injuries || null,
        prefered_split: preferedSplit,
      }
    });

    res.json({ success: true });

  } catch (error) {
    console.log("Error saving profile", error);
    res.status(500).json({ error: "Failed to save profile" });
  }
});