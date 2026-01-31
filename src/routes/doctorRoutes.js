import express from "express";
import { validateRole } from "../middleware/validateRole.js";
import { runPersonaChat } from "../services/llmService.js";
import { doctorAnalyticsInsights } from "../services/analyticsService.js";

const router = express.Router();

// Generic doctor-side assistant chat (pre-consult summary, suggestions, translation)
router.post(
  "/chat",
  validateRole(["doctor"]),
  async (req, res, next) => {
    try {
      const { messages, mode } = req.body;

      if (!Array.isArray(messages)) {
        return res.status(400).json({
          success: false,
          error: "messages must be an array of {role, content}"
        });
      }

      let extraInstructions = "";

      if (mode === "pre_consult_summary") {
        extraInstructions = `
You are in PRE-CONSULT SUMMARY mode.
Take the provided patient history or chat transcript and output:
1) A concise structured summary.
2) A bullet list of key questions the doctor should ask.
3) A short list of possible differentials (clearly labeled as suggestive only).
`;
      } else if (mode === "prescription_draft") {
        extraInstructions = `
You are in PRESCRIPTION DRAFTING mode.
Use ONLY the doctor's explicit instructions in the messages.
Draft a prescription text with sections:
- Provisional diagnosis
- Medications (do not invent new drugs or doses)
- Investigations
- Advice
- Follow-up
Label everything as "for doctor review, not final prescription".
`;
      } else if (mode === "translation") {
        extraInstructions = `
You are in REAL-TIME TRANSLATION mode between doctor and patient.
Translate the content as requested while preserving clinical meaning and politeness.
Do not add extra medical advice.
`;
      }

      const result = await runPersonaChat({
        role: "doctor",
        messages,
        extraInstructions
      });

      res.json({
        success: true,
        role: "doctor",
        answer: result.answer,
        meta: { id: result.id, mode: mode || "generic" }
      });
    } catch (err) {
      next(err);
    }
  }
);

// Practice analytics
router.post(
  "/analytics",
  validateRole(["doctor"]),
  async (req, res, next) => {
    try {
      const { stats } = req.body;

      if (!stats || typeof stats !== "object") {
        return res.status(400).json({
          success: false,
          error: "stats must be a JSON object"
        });
      }

      const result = await doctorAnalyticsInsights({ stats });

      res.json({
        success: true,
        role: "doctor",
        answer: result.answer,
        meta: { id: result.id }
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
