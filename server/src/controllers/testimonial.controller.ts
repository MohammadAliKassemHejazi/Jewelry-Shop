import { Request, Response } from "express";
import db from "../models";

export const getVerifiedTestimonials = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 3;
    const testimonials = await db.Testimonial.findAll({
      where: { verified: true },
      limit,
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await db.Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
