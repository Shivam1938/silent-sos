import type { NextFunction, Request, Response } from 'express';

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  const { method, originalUrl, ip } = req;
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} (${ip})`);
  next();
};

