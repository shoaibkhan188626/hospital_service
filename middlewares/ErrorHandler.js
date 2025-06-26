import logger from "../config/logger.js";
import CustomError from "../utils/error.js";

const errorHandler = (err, req, res, next) => {
  logger.error(
    `${err.name || "Error"}: ${err.message} | Path: ${req.path} | Method: ${req.method}`
  );

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      code: err.code || "UNKNOWN",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: Object.values(err.errors)
        .map((e) => e.message)
        .join(", "),
      code: "VALIDATION_ERROR",
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      status: "error",
      message: "Duplicate key error",
      code: "DUPLICATE_KEY",
    });
  }

  res.status(500).json({
    status: "error",
    message: "Internal server error",
    code: "SERVER_ERROR",
  });
};

export default errorHandler;
