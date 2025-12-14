import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/customError';
import { validationResult } from 'express-validator';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';
  let data: any = undefined;

  // Handle different types of errors
  if (error instanceof CustomError) {
    statusCode = error.statusCode || 500;
    message = error.message;
    code = error.code || 'CUSTOM_ERROR';
    data = error.data;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    code = 'VALIDATION_ERROR';
    data = { details: error.message };
  } else if (error.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Database Validation Error';
    code = 'DB_VALIDATION_ERROR';
    data = { details: error.errors };
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Duplicate Entry';
    code = 'DUPLICATE_ERROR';
    data = { field: error.errors[0]?.path };
  } else if (error.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Foreign Key Constraint Error';
    code = 'FOREIGN_KEY_ERROR';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid Token';
    code = 'INVALID_TOKEN';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token Expired';
    code = 'TOKEN_EXPIRED';
  } else if (error.name === 'MulterError') {
    statusCode = 400;
    message = 'File Upload Error';
    code = 'UPLOAD_ERROR';
    data = { details: error.message };
  }

  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(data && { data }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export const validationErrorHandler = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new CustomError(
      'Validation failed',
      'VALIDATION_ERROR',
      400,
      { errors: errors.array() }
    );
    return next(error);
  }
  next();
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new CustomError(
    `Route ${req.originalUrl} not found`,
    'ROUTE_NOT_FOUND',
    404
  );
  next(error);
};
