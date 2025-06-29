import express from "express";
import hospitalController from "../controllers/hospital.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, hospitalController.createHospital);
router.get("/:id", authMiddleware, hospitalController.getHospital);
router.patch("/:id", authMiddleware, hospitalController.updateHospital);
router.delete("/:id", authMiddleware, hospitalController.deleteHospital);

export default router;
