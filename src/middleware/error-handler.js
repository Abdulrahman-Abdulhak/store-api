import { CustomApiError } from "../errors/index.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  const statusCode = err.statusCode ?? err.code ?? 500;
  return res.status(statusCode).json({ error: err });
};
