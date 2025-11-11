import { Request, Response, NextFunction } from 'express';

export interface IError extends Error {
  statusCode?: number;
  value?: any;
  errors?: any;
  code?: number;
  path?: string;
}

const errorHandler = (err: IError, req: Request, res: Response, next: NextFunction): void => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { name: 'CastError', message, statusCode: 404 };
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const message = `${field} already exists`;
    error = { name: 'DuplicateFieldError', message, statusCode: 400 };
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors || {}).map((val: any) => val.message).join(', ');
    error = { name: 'ValidationError', message, statusCode: 400 };
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { name: 'JsonWebTokenError', message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { name: 'TokenExpiredError', message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;