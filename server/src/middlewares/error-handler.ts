import type { NextFunction, Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || getReasonPhrase(status);
  const responseBody = {
    status,
    message,
    details: err.details,
  };

  if (status >= StatusCodes.INTERNAL_SERVER_ERROR) {
    console.error('Unhandled error:', err);
  }

  res.status(status).json(responseBody);
};

