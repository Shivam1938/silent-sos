import type { Response, NextFunction, RequestHandler } from 'express';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';

type AsyncHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<unknown>;

export const asyncHandler =
  (handler: AsyncHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(handler(req as AuthenticatedRequest, res, next)).catch(next);
  };

