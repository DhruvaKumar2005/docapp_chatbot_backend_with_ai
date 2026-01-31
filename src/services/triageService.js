import { runPersonaChat } from "./llmService.js";

export async function patientSymptomIntakeChat({ conversation }) {
  // conversation = array of { role, content } from frontend
  const extraInstructions = `
You are in SYMPTOM INTAKE + TRIAGE mode.

Goals:
- Ask 3–7 focused follow-up questions as needed.
- At the end, summarize:
  - Structured symptom data in JSON.
  - Triage level.
  - Suggested specialty.

JSON structure:
{
  "chief_complaint": "",
  "onset": "",
  "duration": "",
  "severity": "",
  "associated_symptoms": [],
  "medications": [],
  "allergies": [],
  "relevant_history": [],
  "red_flags": [],
  "triage_level": "emergency | urgent_24h | consult_soon | self_care",
  "suggested_specialty": ""
}

After the JSON, give a short plain-language explanation.
`;

  return runPersonaChat({
    role: "patient",
    messages: conversation,
    extraInstructions
  });
}
