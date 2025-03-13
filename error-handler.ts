// IN argument we have function type which comes in TS
// this method will return a function
// the benefit of this function is that we dont have to write try and catch again and again

import { NextFunction, Request, Response } from "express";
import { ErrorCodes, HttpExceptions } from "./src/exceptions/root";
import { InternalException } from "./src/exceptions/internal-exceptions";
import { User } from "@prisma/client";
import { ZodError } from "zod";
import { BadRequestException } from "./src/exceptions/bad-request";

interface ExtendedRequest extends Request {
  user?: User;
}

export const errorHandler = (
  method: (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpExceptions;
      if (error instanceof HttpExceptions) {
        exception = error;
      } else {
        if (error instanceof ZodError) {
          exception = new BadRequestException(
            "Unprocessible entity",
            ErrorCodes.UNPROCESSABLE_ENTITY
          );
        }
        exception = new InternalException(
          "something went wrong",
          error,
          ErrorCodes.INTERNAL_EXCEPTIONS
        );
      }

      next(exception);
    }
  };
};

// import { Request, Response, NextFunction } from "express";

// interface ExtendedRequest extends Request {
//   user: any;
// }

// export const errorHandler = (
//   fn: (req: ExtendedRequest, res: Response, next: NextFunction) => Promise<void>
// ) => {
//   return (req: ExtendedRequest, res: Response, next: NextFunction) => {
//     fn(req, res, next).catch(next);
//   };
// };
