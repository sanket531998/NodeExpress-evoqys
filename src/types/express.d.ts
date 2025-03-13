import { User } from "@prisma/client";
import express from "express";

declare module "express" {
  export interface Request {
    user?: User;
  }
}

// In the module express there is a interface Request
// and on that request interface we want to attach an extra type which is the user type
