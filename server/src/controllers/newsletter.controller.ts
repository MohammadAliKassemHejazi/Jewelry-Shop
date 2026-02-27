import { Request, Response } from "express";
import db from "../models";

export const subscribe = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    let subscriber = await db.Newsletter.findOne({ where: { email } });
    if (subscriber) {
      if (!subscriber.subscribed) {
        await subscriber.update({ subscribed: true });
      }
      return res.json({ success: true, message: "Already subscribed" });
    }

    await db.Newsletter.create({ email, subscribed: true });
    res.status(201).json({ success: true, message: "Subscribed successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unsubscribe = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const subscriber = await db.Newsletter.findOne({ where: { email } });
    if (subscriber) {
      await subscriber.update({ subscribed: false });
    }
    res.json({ success: true, message: "Unsubscribed successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
