import { NextFunction, Request, Response } from 'express';
import { HttpError } from './httpError';

// Middleware centralizado de errores: los controllers solo hacen next(error)
// y acá se decide qué respuesta HTTP se devuelve.
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: 'Error interno del servidor' });
}
