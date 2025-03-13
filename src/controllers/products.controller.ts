import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { productsSchema } from "../schema/products.schema";
import { User } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

interface ExtendedRequest extends Request {
  user?: User;
}

export const createProduct = async (req: Request, res: Response) => {
  productsSchema.parse(req.body);
  const product = await prismaClient.products.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  res.json(product);
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // we need to wrap in try catch
  // because if the product does not exist: we have to catch it explicitly
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = product.tags.join(",");
    }
    const updatedProduct = await prismaClient.products.update({
      where: {
        // all the params are of type string, so we need to typecast
        id: +req.params.id,
      },
      data: product,
    });

    res.json(updatedProduct);
  } catch (error) {
    throw new NotFoundException(
      "Product not found",
      ErrorCodes.PRODUCT_NOT_FOUND
    );
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleteProduct = await prismaClient.products.delete({
      where: {
        id: +req.params.id,
      },
    });

    res.json(deleteProduct);
  } catch (error) {
    throw new NotFoundException(
      "Product not found",
      ErrorCodes.PRODUCT_NOT_FOUND
    );
  }
};

export const getProducts = async (req: Request, res: Response) => {
  // response structure {count: 100, data: []}

  const count = await prismaClient.products.count();
  const products = await prismaClient.products.findMany({
    skip: +req.query.skip! || 0,
    take: 5,
  });

  res.json({ count, data: products });
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = +req?.params.id;
    const product = await prismaClient.products.findUnique({
      where: { id: id },
    });

    res.json(product);
  } catch (error) {
    throw new NotFoundException(
      "Product with given id not found",
      ErrorCodes.PRODUCT_NOT_FOUND
    );
  }
};
