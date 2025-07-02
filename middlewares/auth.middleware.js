import jwt from "jsonwebtoken";
import CustomError from "../utils/error.js";
import logger from "../config/logger.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    logger.warn(`Unauthorized access attempt | Path: ${req.path}`);
    throw new CustomError(
      "Authorization header missing or invalid",
      401,
      "UNAUTHORIZED"
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.key !== process.env.SERVICE_KEY) {
      logger.warn(`Invalid service key | Path :${req.path}`);
      throw new CustomError("Invalid service key", 403, "FORBIDDEN");
    }
    next();
  } catch (error) {
    logger.error(
      `JWT verification failed : ${error.message} | Path:${req.path}`
    );
    throw new CustomError("Invalid or expired token", 401, "UNAUTHORIZED");
  }
};

export default authMiddleware;
