import logger from "../config/logger.js";

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    logger.info(`${method} ${url}-${status}-${duration}ms -IP: ${ip}`);
  });
  next();
};

export default loggerMiddleware