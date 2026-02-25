// src/ai/genkit.ts
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import 'dotenv/config';

// Initialize Genkit with plugins
export const ai = genkit({
  plugins: [googleAI()],
});
