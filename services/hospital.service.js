import Hospital from "../models/hospital.js";
import CustomError from "../utils/error.js";
import logger from "../config/logger.js";
import httpClient from "../utils/httpClient.js";

const hospitalService = {
  async createHospital(data) {
    try {
      const hospital = new Hospital(data);
      await hospital.save();
      logger.info(`Hospital created: ${hospital._id}`);

      // Send notification
      try {
        await httpClient.post(
          `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
          {
            type: "hospital_created",
            data: {
              hospitalId: hospital.externalId,
              name: hospital.name,
              timestamp: hospital.createdAt,
            },
          }
        );
        logger.info(`Notification sent for hospital: ${hospital._id}`);
      } catch (notificationErr) {
        logger.warn(`Failed to send notification: ${notificationErr.message}`);
      }

      return hospital;
    } catch (err) {
      logger.error(`Failed to create hospital: ${err.message}`);
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
        logger.warn(`Hospital not found: ${id}`);
        throw new CustomError("Hospital not found", 404, "NOT_FOUND");
      }
      return hospital;
    } catch (err) {
      logger.error(`Failed to get hospital: ${err.message}`);
      throw err instanceof CustomError
        ? err
        : new CustomError("Failed to get hospital", 500, "SERVER_ERROR");
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
        logger.warn(`Hospital not found for update: ${id}`);
        throw new CustomError("Hospital not found", 404, "NOT_FOUND");
      }
      logger.info(`Hospital updated: ${id}`);

      // Send notification
      try {
        await httpClient.post(
          `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
          {
            type: "hospital_updated",
            data: {
              hospitalId: hospital.externalId,
              name: hospital.name,
              timestamp: hospital.updatedAt,
            },
          }
        );
        logger.info(`Notification sent for hospital update: ${id}`);
      } catch (notificationErr) {
        logger.warn(`Failed to send notification: ${notificationErr.message}`);
      }

      return hospital;
    } catch (err) {
      logger.error(`Failed to update hospital: ${err.message}`);
      throw err instanceof CustomError
        ? err
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
        logger.warn(`Hospital not found for deletion: ${id}`);
        throw new CustomError("Hospital not found", 404, "NOT_FOUND");
      }
      logger.info(`Hospital soft-deleted: ${id}`);
      return hospital;
    } catch (err) {
      logger.error(`Failed to delete hospital: ${err.message}`);
      throw err instanceof CustomError
        ? err
        : new CustomError("Failed to delete hospital", 500, "SERVER_ERROR");
    }
  },
};

export default hospitalService;
