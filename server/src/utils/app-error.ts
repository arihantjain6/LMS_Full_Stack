export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational = true;

  public constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
