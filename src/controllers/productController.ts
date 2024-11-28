import { Request, Response } from "express";
import { Product } from "../models/productModel";
import { handleDatabaseError } from "../utils/index";

/**
 * Creates a new product.
 *
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @throws {Error} If database query fails.
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Create a new product using the request body data
    const product = await Product.create(req.body);
    // Return the newly created product with a 201 status code
    res.status(201).json(product);
  } catch (error) {
    handleDatabaseError(error as Error, res, 500);
  }
};

/**
 * Updates a product by name.
 *
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @throws {Error} If database query fails.
 */
export const updateProductByName = async (req: Request, res: Response) => {
  // Get the product name from the request parameters
  const { name } = req.params;
  try {
    // Update the product using the request body data and return the updated product
    const product = await Product.findOneAndUpdate(
      { name },
      { $set: { ...req.body } },
      { new: true }
    );
    // Return the updated product with a 200 status code
    res.status(200).json(product);
  } catch (error) {
    handleDatabaseError(error as Error, res, 500);
  }
};

/**
 * Deletes a product by name.
 *
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @throws {Error} If database query fails.
 */
export const deleteProductByName = async (req: Request, res: Response) => {
  // Get the product name from the request parameters
  const { name } = req.params;
  try {
    // Delete the product and return the deleted product
    const product = await Product.findOneAndDelete({ name });
    // Return the deleted product with a 200 status code
    res.status(200).json(product);
  } catch (error) {
    handleDatabaseError(error as Error, res, 500);
  }
};

/**
 * Retrieves all products.
 *
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @throws {Error} If database query fails.
 */
export const getProducts = async (req: Request, res: Response) => {
  try {
    // Retrieve all products from the database
    const products = await Product.find();
    // Return the products with a 200 status code
    res.status(200).json(products);
  } catch (error) {
    handleDatabaseError(error as Error, res, 500);
  }
};

/**
 * Retrieves a product by name.
 *
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @throws {Error} If database query fails.
 */
export const getProductByName = async (req: Request, res: Response) => {
  // Extract the product name from the request parameters
  const { name } = req.params;

  try {
    // Query the database to find a product with the provided name
    const product = await Product.findOne({ name });

    // Return the product with a 200 status code
    res.status(200).json(product);
  } catch (error) {
    handleDatabaseError(error as Error, res, 500);
  }
};
