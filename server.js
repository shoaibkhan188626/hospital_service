import app from "./app";
import mongoose from "mongoose";
import { connectDB } from "./config/database.js";
import logger from "./config/logger.js";

const PORT = process.env.PORT || 8082;

connectDB()
  .then(() => {
    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(`Failed to connect to MongoDB: ${err.message}`);
    process.exit(1);
  });

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection :${err.message}`);
  process.exit(1);
});
