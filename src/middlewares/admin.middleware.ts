import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import { User } from "@prisma/client";

// the order of middleware we use is important
// first we have to use

interface ExtendedRequest extends Request {
  user?: User;
}

export const adminMiddleware = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req?.user;
  if (user?.role === "ADMIN") {
    next();
  } else {
    next(
      new UnAuthorizedException(
        "Unauthorised",
        404,
        ErrorCodes.UNAUTHORIZED_ACCESS
      )
    );
  }
};
