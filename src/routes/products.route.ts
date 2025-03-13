import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/products.controller";
import { errorHandler } from "../../error-handler";
import authMiddleware from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { error } from "console";

export const productRoutes: Router = Router();

productRoutes
  .route("/createProduct")
  .post([authMiddleware, adminMiddleware], errorHandler(createProduct));

productRoutes.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);
productRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
);

productRoutes.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(getProducts)
);

productRoutes.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getProductById)
);
