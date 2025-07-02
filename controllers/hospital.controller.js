import hospitalService from '../services/hospital.service.js';
import hospitalValidation from '../validations/hospital.validation.js';
import logger from '../config/logger.js';
import CustomError from '../utils/error.js';

const hospitalController = {
  async createHospital(req, res, next) {
    try {
      // Validate input
      const { error, value } = hospitalValidation.createHospital.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        logger.warn(`Validation failed: ${error.message}`);
        throw new CustomError(error.message, 400, 'VALIDATION_ERROR');
      }

      const hospital = await hospitalService.createHospital(value);
      res.status(201).json({
        status: 'success',
        data: hospital,
      });
    } catch (err) {
      next(err);
    }
  },

  async getHospital(req, res, next) {
    try {
      const hospital = await hospitalService.getHospitalById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: hospital,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateHospital(req, res, next) {
    try {
      // Validate input
      const { error, value } = hospitalValidation.updateHospital.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        logger.warn(`Validation failed: ${error.message}`);
        throw new CustomError(error.message, 400, 'VALIDATION_ERROR');
      }

      const hospital = await hospitalService.updateHospital(req.params.id, value);
      res.status(200).json({
        status: 'success',
        data: hospital,
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteHospital(req, res, next) {
    try {
      await hospitalService.deleteHospital(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

export default hospitalController;