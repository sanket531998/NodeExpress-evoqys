import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCodes } from "../exceptions/root";
import { SignUpSchema } from "../schema/users.schema";
import { NotFoundException } from "../exceptions/not-found";
import { User } from "@prisma/client";

interface ExtendedRequest extends Request {
  user?: User;
}

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  SignUpSchema.parse(req.body);
  const { name, password, email } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email: email } });
  if (user) {
    new BadRequestException(
      "User already exists",
      ErrorCodes.USER_ALREADY_EXISTS
    );
  }
  // when we call the next function without the error the control is passed to the next middleware or the controller
  // but when we call the next function with error object the control is directly passed to the error middleware
  // and express knows about it through the error middleware which we used in the index.js file

  user = await prismaClient.user.create({
    data: { name: name, email, password: hashSync(password, 10) },
  });

  res.send(user);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (!user) {
    throw new NotFoundException(
      "User does not exist",
      ErrorCodes.USER_NOT_FOUND
    );
  }
  if (!compareSync(password, user!.password)) {
    throw new BadRequestException(
      "Incorrect password",
      ErrorCodes.INCORRECT_PASSWORD
    );
  }

  const token = jwt.sign(
    {
      id: user!.id,
    },
    JWT_SECRET
  );

  res.send({ user, token });
};

export const me = async (req: ExtendedRequest, res: Response) => {
  // const { password, ...detailsWithoutPassword } = req?.user;
  res.json(req?.user);
};
