import express from "express";
import {
  getProductByName,
  updateProductByName,
  deleteProductByName,
  getProducts,
  createProduct,
} from "../controllers/productController";
import {
  checkProductNameMiddleware,
  validateProductMiddleware,
} from "../middlewares/productMiddleware";
import { authenticate, authorize } from "../middlewares/authMiddleware";

export const productRouter = express.Router();

productRouter.post("/", authenticate, validateProductMiddleware, createProduct);
productRouter.put( "/:name", authenticate, authorize("admin"), checkProductNameMiddleware,
  validateProductMiddleware,
  updateProductByName
);
productRouter.delete("/:name", authenticate, authorize("admin"),
  checkProductNameMiddleware,
  deleteProductByName
);
productRouter.get("/:name", authenticate,checkProductNameMiddleware,
  getProductByName
);
productRouter.get("/", authenticate, getProducts);
