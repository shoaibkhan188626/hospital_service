import Hospital from "../models/hospital.js";
import CustomError from "../utils/error.js";
import logger from "../config/logger.js";

const hospitalService = {
  async createHospital(data) {
    try {
      const hospital = new Hospital(data);
      await hospital.save();
      logger.info(`Hospital created: ${hospital._id}`);
      return hospital;
    } catch (error) {
      logger.error(`Failed to create hospital:${error.message}`);
      throw new CustomError("Failed to create hospital", 400, "CREATE_FAILED");
    }
  },

  async getHospitalById(id) {
    try {
      const hospital = await Hospital.findOne({
        externalId: id,
        deleted: false,
      });
      if (!hospital) {
        logger.warn(`Hospital not found :${id}`);
        throw new CustomError("Hospital not found", 404, "NOT_FOUND");
      }
      return hospital;
    } catch (error) {
      logger.error(`Failed to get hospital :${error.message}`);
      throw error instanceof CustomError
        ? error
        : new CustomError("failed to get hospital", 500, "SERVER_ERROR");
    }
  },

  async updateHospital(id, data) {
    try {
      const hospital = await Hospital.findOneAndUpdate(
        { externalId: id, deleted: false },
        { ...data, updatedAt: Date.now() },
        { new: true }
      );
      if (!hospital) {
        logger.warn(`Hospital not found for update:${id}`);
        throw new CustomError("Hospital not found ", 404, "NOT_FOUND");
      }
      logger.info(`Hospital updated: ${id}`);
      return hospital;
    } catch (error) {
      logger.error(`Failed to update hospital:${error.message}`);
      throw error instanceof CustomError
        ? error
        : new CustomError("Failed to update hospital", 500, "SERVER_ERROR");
    }
  },

  async deleteHospital(id) {
    try {
      const hospital = await Hospital.findOneAndUpdate(
        { externalId: id, deleted: false },
        { deleted: true, updatedAt: Date.now() },
        { new: true }
      );
      if (!hospital) {
        logger.warn(`Hospital not found for deletion:${id}`);
        throw new CustomError("Hospital not found", 404, "NOT_FOUND");
      }
      logger.info(`Hospotal soft deleted :${id}`);
      return hospital;
    } catch (error) {
      logger.error(`Failed to delete hospital ;${error.message}`);
      throw error instanceof CustomError
        ? error
        : new CustomError("Failed to delete hospital", 500, "SERVER_ERROR");
    }
  },
};

export default hospitalService;
