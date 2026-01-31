import express from "express";
import patientRoutes from "./patientRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import healthRoutes from "./healthRoutes.js";

const router = express.Router();

router.use("/patient", patientRoutes);
router.use("/doctor", doctorRoutes);
router.use("/", healthRoutes);

export default router;
