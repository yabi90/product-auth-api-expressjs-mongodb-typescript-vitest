import { Request, Response, NextFunction } from 'express';
import { Product } from "../models/productModel";
import { validatePositiveNumber } from '../utils/index';

/**
 * Middleware to validate product data.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 */
export const validateProductMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { name, quantity, price } = req.body;

  /**
   * Check if product name is provided and valid.
   */
  if (req.method === "POST" && (!name || name.trim() === "" || name.length < 3)) {
    res.status(400).json({ message: "Product name is required and must be at least 3 characters." });
    return;
  }

  /**
   * Validate price.
   */
  const priceError = validatePositiveNumber(price, 'price');
  if (priceError) {
    res.status(400).json(priceError);
    return;
  }

  /**
   * Validate quantity.
   */
  const quantityError = quantity && validatePositiveNumber(quantity, 'quantity');
  if (quantityError) {
    res.status(400).json(quantityError);
    return;
  }

  /**
   * Check if the product already exists in the database.
   */
  if (req.method !== "POST") {
    next();
    return;
  }

  try {
    const product = await Product.findOne({ name });
    if (product) {
      res.status(409).json({
        message: `Product with the name '${name}' already exists.`,
      });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error while checking product." });
    return;
  }
};

/**
 * Middleware to check if a product exists.
 * 
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 */
export const checkProductNameMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params;

  /**
   * Check if product name is provided.
   */
  if (!name || name.trim() === "") {
    res.status(400).json({ message: "Product name is required" });
    return;
  }

  /**
   * Check if the product exists in the database.
   */
  try {
    const product = await Product.findOne({ name });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    next();
  } catch (error) {
    const errorMessage = (error instanceof Error) ? `Database query error: ${error.message}` : 'An unknown error occurred';
    console.error(errorMessage);
    res.status(500).json({ message: errorMessage });
    return;
  }
 
};