// Error con código HTTP: el service lo lanza y el errorHandler sabe qué status responder
export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Empleado no encontrado') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}
