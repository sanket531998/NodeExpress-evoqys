import { Router } from "express";
import {
  addAddress,
  deleteAddress,
  listAddress,
} from "../controllers/user.controller";
import { errorHandler } from "../../error-handler";
import authMiddleware from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

export const userRoutes: Router = Router();

userRoutes
  .route("/address")
  .post([authMiddleware, adminMiddleware], errorHandler(addAddress));
userRoutes
  .route("/address/:id")
  .delete([authMiddleware, adminMiddleware], errorHandler(deleteAddress));
userRoutes
  .route("/address")
  .get([authMiddleware, adminMiddleware], errorHandler(listAddress));
