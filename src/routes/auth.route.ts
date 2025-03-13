import { Router } from "express";
import { login, me, signUp } from "../controllers/auth.controllers";
import { errorHandler } from "../../error-handler";
import authMiddleware from "../middlewares/auth.middleware";

const authRoutes: Router = Router();

authRoutes.route("/signup").post(errorHandler(signUp));
authRoutes.route("/login").post(errorHandler(login));
authRoutes.route("/me").post([authMiddleware], errorHandler(me));

export default authRoutes;
