import { logger } from '../utils/logger.js';

export const logMiddleware = (req, _, next) => {
  req.logger = logger;
  req.logger.info(`${req.method} -${req.originalUrl}`);
  next();
};
