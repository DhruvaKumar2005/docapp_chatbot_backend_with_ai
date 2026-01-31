import { createChatCompletion } from "../config/mistralClient.js";
import { PATIENT_AI_PROMPT } from "../config/prompts/patientPrompt.js";
import { DOCTOR_AI_PROMPT } from "../config/prompts/doctorPrompt.js";
import { SAFETY_PROMPT } from "../config/prompts/safetyPrompt.js";

function buildSystemPrompt(role) {
  if (role === "doctor") {
    return `${SAFETY_PROMPT}\n\n${DOCTOR_AI_PROMPT}`;
  }
  // default to patient role if not specified
  return `${SAFETY_PROMPT}\n\n${PATIENT_AI_PROMPT}`;
}

/**
 * messages: [{ role: "user" | "assistant" | "system", content: "..." }]
 * role: "patient" | "doctor"
 * extraInstructions: optional string appended as system message
 */
export async function runPersonaChat({ role, messages, extraInstructions }) {
  const systemPrompt = buildSystemPrompt(role);

  const fullMessages = [
    { role: "system", content: systemPrompt },
    ...(extraInstructions
      ? [{ role: "system", content: extraInstructions }]
      : []),
    ...messages
  ];

  const data = await createChatCompletion({ messages: fullMessages });

  const choice = data.choices?.[0];
  const answer = choice?.message?.content || "";

  return {
    id: data.id,
    role,
    answer,
    raw: data
  };
}
