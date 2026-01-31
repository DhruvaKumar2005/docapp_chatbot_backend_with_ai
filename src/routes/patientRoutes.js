import express from "express";
import { validateRole } from "../middleware/validateRole.js";
import { runPersonaChat } from "../services/llmService.js";
import { patientSymptomIntakeChat } from "../services/triageService.js";

const router = express.Router();

// Generic patient-side chat (education, doctor matching, etc.)
router.post(
  "/chat",
  validateRole(["patient"]), // require x-docapp-role: patient
  async (req, res, next) => {
    try {
      const { messages } = req.body;

      if (!Array.isArray(messages)) {
        return res.status(400).json({
          success: false,
          error: "messages must be an array of {role, content}"
        });
      }

      const result = await runPersonaChat({
        role: "patient",
        messages
      });

      res.json({
        success: true,
        role: "patient",
        answer: result.answer,
        meta: { id: result.id }
      });
    } catch (err) {
      next(err);
    }
  }
);

// Symptom intake + triage focused route
router.post(
  "/symptom-intake",
  validateRole(["patient"]),
  async (req, res, next) => {
    try {
      const { conversation } = req.body;

      if (!Array.isArray(conversation)) {
        return res.status(400).json({
          success: false,
          error: "conversation must be an array of {role, content}"
        });
      }

      const result = await patientSymptomIntakeChat({ conversation });

      res.json({
        success: true,
        role: "patient",
        answer: result.answer,
        meta: { id: result.id }
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
