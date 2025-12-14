import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { CustomError } from "../utils/customError";
import { productsService } from "../services";

// Get all products with filters and pagination
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      minPrice,
      maxPrice,
      materials,
      gemstones,
      onSale,
      featured,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filters = {
      category: category as string,
      subcategory: subcategory as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      materials: materials ? (materials as string).split(',') : undefined,
      gemstones: gemstones ? (gemstones as string).split(',') : undefined,
      onSale: onSale === 'true',
      featured: featured === 'true',
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    };

    const result = await productsService.getAllProducts(
      filters,
      parseInt(page as string),
      parseInt(limit as string)
    );

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

// Get featured products
export const getFeaturedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit = 6 } = req.query;
    const products = await productsService.getFeaturedProducts(parseInt(limit as string));
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new CustomError("Product ID is required", "MISSING_PRODUCT_ID", 400);
    }

    const product = await productsService.getProductById(id);
    
    if (!product) {
      throw new CustomError("Product not found", "PRODUCT_NOT_FOUND", 404);
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Create product (admin only)
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError("Validation failed", "VALIDATION_ERROR", 400, { errors: errors.array() });
    }

    const productData = req.body;
    const product = await productsService.createProduct(productData);

    res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Update product (admin only)
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      throw new CustomError("Product ID is required", "MISSING_PRODUCT_ID", 400);
    }

    const product = await productsService.updateProduct(id, updateData);

    res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Delete product (admin only)
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new CustomError("Product ID is required", "MISSING_PRODUCT_ID", 400);
    }

    await productsService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category
export const getProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category } = req.params;
    const { limit = 12 } = req.query;

    if (!category) {
      throw new CustomError("Category is required", "MISSING_CATEGORY", 400);
    }

    const products = await productsService.getProductsByCategory(category, parseInt(limit as string));

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Search products
export const searchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    if (!q) {
      throw new CustomError("Search query is required", "MISSING_SEARCH_QUERY", 400);
    }

    const filters = {
      search: q as string,
      category: category as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc'
    };

    const products = await productsService.searchProducts(filters);

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get product statistics (admin only)
export const getProductStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await productsService.getProductStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const productsController = {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  getProductStats
};

export default productsController;
