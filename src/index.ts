import express, {
  ErrorRequestHandler,
  Express,
  Request,
  Response,
} from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/error.middleware";

const app: Express = express();

app.use(express.json());
app.use("/api/v1", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

// now whenever any controller throws any exception this middleware will catch it
app.use(errorMiddleware as ErrorRequestHandler);

app.listen(PORT, () => {
  console.log("app working");
});
