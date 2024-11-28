import mongoose, { Schema, Document } from "mongoose";

/**
 * Interface for the Product document.
 */
export interface IProduct extends Document {
  /**
   * Name of the product.
   */
  name: string;

  /**
   * Quantity of the product in stock.
   */
  quantity: number;

  /**
   * Price of the product.
   */
  price: number;
}

/**
 * Schema for the Product document.
 */
const productSchema = new Schema({
  /**
   * Name of the product.
   */
  name: {
    type: String,
    required: [true, "Please enter product name"],
    unique: true,
    maxlength: [100, 'Product name cannot be longer than 100 characters'],
  },

  /**
   * Quantity of the product in stock.
   */
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },

  /**
   * Price of the product.
   */
  price: {
    type: Number,
    required: true,
    default: 0.00,
  },
}, {
  /**
   * Automatically add createdAt and updatedAt timestamps to the document.
   */
  timestamps: true,
});

/**
 * Mongoose model for the Product document.
 */
export const Product = mongoose.model<IProduct>("Product", productSchema);