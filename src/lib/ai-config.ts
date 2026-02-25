// src/lib/ai-config.ts

// This file is no longer the primary source for AI prompting logic,
// as that has been moved to the more powerful Genkit flow in
// src/ai/flows/generate-ai-reply.ts.
// It is kept for simple configuration values.

export const AI_CONFIG = {
  model: "deepseek-chat",
  temperature: 0.7,
  maxTokens: 500,
};
