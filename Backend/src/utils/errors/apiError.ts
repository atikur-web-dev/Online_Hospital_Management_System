// Backend/src/utils/errors/apiError.ts
export class ApiError extends Error {
  statusCode: number;
  status: boolean;
  errors: Record<string, string[]> | object;
  constructor(
    statusCode: number = 500,
    message: string = 'Something went wrong',
    errors: Record<string, string[]> | object,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = false;
    this.errors = errors;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
