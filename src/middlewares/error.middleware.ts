// in error middlewares there is a general convention that first argument is error

import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpExceptions } from "../exceptions/root";

export const errorMiddleware = (
  error: HttpExceptions,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCodes: error.errorCode,
    errors: error.errors,
  });
};
