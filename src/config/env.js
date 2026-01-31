import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  mistralApiKey: process.env.MISTRAL_API_KEY,
  mistralModel: process.env.MISTRAL_MODEL || "mistral-small-latest",
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "").split(",").map(o => o.trim()).filter(Boolean),
  nodeEnv: process.env.NODE_ENV || "development"
};

if (!config.mistralApiKey) {
  console.warn("WARNING: MISTRAL_API_KEY is not set. LLM calls will fail.");
}
