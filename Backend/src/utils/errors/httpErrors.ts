// Backend/src/utils/errors/httpErrors.ts
import { ApiSuccess } from '../success/apiSuccess.js';
// Backend/src/Utils/errors/httpErrors.ts
import { ApiError } from './apiError.js';
export class CreatedResponse<T> extends ApiSuccess<T> {
  constructor(data?: T, message: string = 'Resources created successfully') {
    super(201, true, message, data);
  }
}

export class OkResponse<T> extends ApiSuccess<T> {
  constructor(data?: T, message: string = 'OK') {
    super(200, true, message, data);
  }
}

export class BadRequestError extends ApiError {
  constructor(
    errors: Record<string, string[]> = {},
    message: string = 'Bad Request',
  ) {
    super(400, message, errors);
  }
}

export class ValidationError extends ApiError {
  constructor(
    errors: Record<string, string[]> = {},
    message: string = 'Validation Error',
  ) {
    super(422, message, errors);
  }
}

export class NotFoundError extends ApiError {
  constructor(
    errors: Record<string, string[]> = {},
    message: string = 'Resources Not Found',
  ) {
    super(404, message, errors);
  }
}

export class ConflictError extends ApiError {
  constructor(
    errors: Record<string, string[]> = {},
    message: string = 'Conflict',
  ) {
    super(409, message, errors);
  }
}

export class UnauthorizeError extends ApiError {
  constructor(
    errors: Record<string, string[]> = {},
    message: string = 'Not Authorized',
  ) {
    super(401, message, errors);
  }
}

export class InternalServerError extends ApiError {
  constructor(
    errors: Record<string, string[]> = {},
    message: string = 'Internal Server Error',
  ) {
    super(500, message, errors);
  }
}

export class ForbiddenError extends ApiError {
  constructor(
    errors: Record<string, string[]> = {},
    message: string = 'Forbidden',
  ) {
    super(403, message, errors);
  }
}
