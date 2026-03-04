import { NextFunction, Request, Response } from "express";
import * as  categoryService  from "../services/category.service";
import customError from "../utils/customError";
import categoryErrors from "../utils/errors/category.errors";
import db from "../models";

export const handleFetchCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await categoryService.fetchCategories();
    res.json(categories);
  } catch (error) {
    next(customError(categoryErrors.CategoryFetchFailure));
  }
};

export const handleCreateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400).json({ error: "Category name is required" });
    return;
  }

  try {
    const category = await categoryService.createCategory({ name, description });
    res.status(201).json(category);
  } catch (error) {
    next(customError(categoryErrors.CategoryCreateFailure));
  }
};

export const handleUpdateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;
  const { name, description } = req.body;

  if (!id || !name) {
    res.status(400).json({ error: "Category ID and name are required" });
    return;
  }

  try {
    const category = await categoryService.updateCategory(id, { name, description });
    res.json(category);
  } catch (error) {
    next(customError(categoryErrors.CategoryUpdateFailure));
  }
};

export const handleDeleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ error: "Category ID is required" });
    return;
  }

  try {
    await categoryService.deleteCategory(id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    next(customError(categoryErrors.CategoryDeleteFailure));
  }
};

export const handleGetCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await db.Category.findByPk(id, {
      include: [
        {
          model: db.SubCategory,
        },
      ],
    });
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }
    res.json({ success: true, data: category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetCategoryTree = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await db.Category.findAll({
      include: [
        {
          model: db.SubCategory,
        },
      ],
    });
    res.json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};