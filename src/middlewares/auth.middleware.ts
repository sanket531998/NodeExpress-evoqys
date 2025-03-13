import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { User } from "@prisma/client";

interface ExtendedRequest extends Request {
  user?: User;
}

const authMiddleware = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  // 1. Extract the token from the header
  const token = req.headers.authorization;

  // 2. If there is no token, throw unauthorized error
  if (!token) {
    next(
      new UnAuthorizedException(
        "Unauthorized",
        404,
        ErrorCodes.UNAUTHORIZED_ACCESS
      )
    );
  }

  try {
    // 3. If token is present, verfiy it and extract the payload
    const payload = jwt.verify(token!, JWT_SECRET) as any;

    // 4. Get the user from the payload
    const user = await prismaClient.user.findFirst({
      where: { id: payload.id },
    });
    if (!user) {
      next(
        new UnAuthorizedException(
          "Unauthorized",
          404,
          ErrorCodes.UNAUTHORIZED_ACCESS
        )
      );
    }

    // 5. to attach the user to the current request object
    req.user = user!;
    next();
  } catch (error) {
    next(
      new UnAuthorizedException(
        "Unauthorized",
        404,
        ErrorCodes.UNAUTHORIZED_ACCESS
      )
    );
  }
};

export default authMiddleware;
