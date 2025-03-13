import { HttpExceptions } from "./root";

export class NotFoundException extends HttpExceptions {
  constructor(message: string, errorCodes: number) {
    super(message, errorCodes, 404, null);
  }
}
