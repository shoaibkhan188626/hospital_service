import hospitalService from "../services/hospital.service.js";
import logger from "../config/logger.js";

const hospitalController = {
  async createHospital(req, res, next) {
    try {
      const hospitalData = {
        name: req.body.name,
        address: {
          streets: req.body.address?.street,
          city: req.body.address?.city,
          state: req.body.address?.state,
          pincode: req.body.address?.pincode,
        },
        location: {
          type: "Point",
          coordinates: req.body.location?.coordinates,
        },
        contact: {
          phone: req.body.contact?.phone,
          email: req.body.contact?.email,
        },
      };

      const hospital = await hospitalService.createHospital(hospitalData);
      res.status(201).json({
        status: "success",
        data: hospital,
      });
    } catch (error) {
      next(error);
    }
  },

  async getHospital(req, res, next) {
    try {
      const hospital = await hospitalService.getHospitalById(req.params.id);
      res.status(200).json({
        status: "success",
        data: hospital,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateHospital(req, res, next) {
    try {
      const hospitalData = {
        name: req.body.name,
        address: {
          street: req.body.address?.street,
          city: req.body.address?.city,
          state: req.body.address?.state,
          pincode: req.body.address?.pincode,
        },
        location: {
          type: "Point",
          coordinates: req.body.location?.coordinates,
        },
        contact: {
          phone: req.body.contact?.phone,
          email: req.body.contact?.email,
        },
      };

      const hospital = await hospitalService.updateHospital(
        req.params.id,
        hospitalData
      );
      res.status(200).json({
        status: "success",
        data: hospital,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteHospital(req, res, next) {
    try {
      await hospitalService.deleteHospital(req.params.id);
      res.status(204).json({
        status: "success",
        message: "Hospital deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

export default hospitalController;
