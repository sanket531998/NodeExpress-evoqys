import { HttpExceptions } from "./root";

export class BadRequestException extends HttpExceptions {
  constructor(message: string, errorCodes: number) {
    super(message, errorCodes, 400, null);
  }
}
