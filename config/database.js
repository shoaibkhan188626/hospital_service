import mongoose from "mongoose";
import logger from "./logger.js";

export const connectDB = async () => {
  const uri =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI_ATLAS
      : process.env.MONGO_URI_LOCAL;
  if (!uri) {
    throw new Error("MongoDB URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(uri);
    logger.info("Connected to MONGODB");
  } catch (error) {
    logger.error(`MongoDB connection error:${error.message}`);
    throw error;
  }
};

