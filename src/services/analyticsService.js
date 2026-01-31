import { runPersonaChat } from "./llmService.js";

export async function doctorAnalyticsInsights({ stats }) {
  const extraInstructions = `
You are in PRACTICE ANALYTICS mode.

The user will send a JSON object called "stats" with fields such as:
- total_appointments, revenue_by_day, cases_by_specialty, etc.

Task:
- In 3–6 bullet points, derive simple patterns: peak days/times, popular specialties,
  revenue trends, follow-up vs new cases, etc.
- Be concise and data-focused.
`;

  const messages = [
    {
      role: "user",
      content: `Here are the stats JSON:\n${JSON.stringify(stats, null, 2)}`
    }
  ];

  return runPersonaChat({
    role: "doctor",
    messages,
    extraInstructions
  });
}
