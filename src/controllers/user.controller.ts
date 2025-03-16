import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/users.schema";
import { prismaClient } from "..";
import { Address, User } from "@prisma/client";
import { ErrorCodes } from "../exceptions/root";
import { NotFoundException } from "../exceptions/not-found";
import { BadRequestException } from "../exceptions/bad-request";

interface ExtendedRequest extends Request {
  user?: User;
}

export const addAddress = async (req: ExtendedRequest, res: Response) => {
  AddressSchema.parse(req.body);

  const address = await prismaClient.address.create({
    data: {
      ...req?.body,
      userId: req?.user?.id,
    },
  });

  res.json(address);
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const deletedAddress = await prismaClient.address.delete({
      where: { id: +req?.params?.id },
    });
    res.json({ deletedAddress, status: "success" });
  } catch (error) {
    throw new NotFoundException(
      "Addrress with given ID not found",
      ErrorCodes.ADDRESS_NOT_FOUND
    );
  }
};

export const listAddress = async (req: ExtendedRequest, res: Response) => {
  const addresses = await prismaClient.address.findMany({
    where: { userId: req?.user?.id },
  });

  res.json(addresses);
};

export const updateUser = async (req: ExtendedRequest, res: Response) => {
  const validatedData = UpdateUserSchema.parse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: { id: validatedData.defaultShippingAddress },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address not found",
        ErrorCodes.ADDRESS_NOT_FOUND
      );
    }
    if (shippingAddress.userId != req?.user?.id) {
      throw new BadRequestException(
        "address not found",
        ErrorCodes.ADDRESS_NOT_FOUND
      );
    }
  }
  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: { id: validatedData.defaultBillingAddress },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address not found",
        ErrorCodes.ADDRESS_DOES_NOT_BELONG
      );
    }
    if (billingAddress.userId != req?.user?.id) {
      throw new BadRequestException(
        "address not found",
        ErrorCodes.ADDRESS_DOES_NOT_BELONG
      );
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: { id: req?.user?.id },
    data: validatedData,
  });

  res.json(updatedUser);
};
