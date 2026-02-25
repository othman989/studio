// src/ai/flows/generate-ai-reply.ts

/**
 * @fileOverview A Genkit flow that generates a context-aware AI reply to a customer review.
 * It uses the integrated Gemini model via the googleAI plugin for robust, structured output.
 */
export const runtime = "nodejs";

import { ai } from '@/ai/genkit';
import { adminDb } from '@/lib/firebase-admin';
import { z } from 'zod';

// 1. Define Schemas for structured I/O
// =======================================

// Input schema remains the same
const GenerateAiReplyInputSchema = z.object({
  clientId: z.string().describe('The unique ID of the client.'),
  reviewText: z.string().describe('The text content of the customer review.'),
  rating: z.number().min(1).max(5).describe('Star rating from 1 to 5.'),
  authorName: z.string().optional().describe('The name of the reviewer.'),
  businessName: z.string().describe('The name of the business receiving the review.'),
  tone: z.string().default('professional').describe('The desired tone for the reply.'),
  language: z.string().default('autodetect').describe('The language for the reply.'),
  template: z.string().optional().describe('Custom instructions for the AI response.'),
  // NEW: Pass business info directly into the prompt context
  businessInfo: z.object({
    specialOffer: z.string().optional(),
    contactInfo: z.string().optional(),
  }).optional(),
});

// Output schema is now structured for reliability
const GenerateAiReplyOutputSchema = z.object({
  replyText: z.string().describe('The generated AI reply, ready to be published.'),
  sentiment: z.enum(['positive', 'neutral', 'negative']).describe('The analyzed sentiment of the customer review.'),
});

export type GenerateAiReplyInput = z.infer<typeof GenerateAiReplyInputSchema>;
export type GenerateAiReplyOutput = z.infer<typeof GenerateAiReplyOutputSchema>;


// 2. Define the Genkit Prompt
// =======================================

const replyGeneratorPrompt = ai.definePrompt({
  name: "replyGeneratorPrompt",
  input: { schema: GenerateAiReplyInputSchema },
  output: { schema: GenerateAiReplyOutputSchema },

  prompt: `You are an expert customer service manager for {{businessName}}. Your task is to analyze a customer review and write a perfect, on-brand reply that fully complies with Google Business Profile policies.

## Compliance & Safety Requirements (ALWAYS FOLLOW THESE)

- NEVER offer, promise, or imply discounts, coupons, refunds, gifts, rewards, or other incentives in exchange for leaving a review or changing/removing an existing review.
- Do NOT ask the customer to change, update, or remove their review.
- Do NOT argue with the customer, blame them, or criticize them. Always remain calm, respectful, and empathetic, even if the review is unfair.
- Do NOT include legal, medical, or other regulated professional advice.
- Vary your wording and sentence structure across replies. Avoid using the exact same sentences for different reviews so that replies do not look like spam.

If you mention any ongoing offers or value propositions (for example, {{businessInfo.specialOffer}}), describe them only as general information about the business, NOT as a reward for leaving a review or changing a review.

## Review Analysis

The customer left a rating of {{rating}} out of 5 stars.

The review text is:
"{{{reviewText}}}"

Classify the sentiment of the review as one of:
- "positive"
- "neutral"
- "negative"

Use both the rating and the text to decide (low ratings are usually negative, high ratings usually positive, 3 stars often neutral).

## Reply Generation Guidelines

Write a natural, human-sounding reply addressed to the customer ({{authorName}} if available).

General rules for any rating:
- Always begin by thanking the customer for their feedback.
- Use the tone: **{{tone}}**.
- The reply language must be **{{language}}**. If "autodetect", infer the language from the review and reply in that language.
- Keep the reply concise but warm and helpful (usually 2–5 short sentences).
- Use varied phrasing to avoid repetitive replies.

### If the sentiment is positive (typically ratings 4–5):

- Be enthusiastic and appreciative.
- You may highlight a general value proposition or quality about the business (for example, {{businessInfo.specialOffer}}) as something the business is proud of, BUT:
  - Do NOT present it as a reward for the review.
  - Do NOT suggest the offer is conditional on leaving or changing a review.

### If the sentiment is neutral (typically rating 3):

- Thank them and acknowledge that their experience was mixed.
- Briefly address any concerns they mention.
- Express a desire to improve and invite them back.

### If the sentiment is negative (typically ratings 1–2):

- Apologize sincerely and show empathy for their experience.
- Do NOT blame or argue with the customer; focus on understanding and resolving the issue.
- ALWAYS invite the customer to continue the conversation privately/offline so you can resolve it.
  - Use this contact information in a natural way: {{businessInfo.contactInfo}}
  - Example language (adapt to the review's language and tone, do not copy exactly): "Please contact us at [contact info] so we can look into this further and try to make things right."

## Optional Custom Instructions

{{#if template}}
The business has provided these additional custom instructions. You MUST follow them as long as they do not conflict with the compliance rules above:

"{{{template}}}"
{{/if}}

## Output Format

You must return a JSON object with exactly these fields:
- "replyText": the final reply text, ready to be posted to the review.
- "sentiment": one of "positive", "neutral", or "negative".

Do not include any extra keys.
`,
});


// 3. Define the Genkit Flow
// =======================================

const generateAiReplyFlow = ai.defineFlow(
  {
    name: 'generateAiReplyFlow',
    inputSchema: GenerateAiReplyInputSchema,
    outputSchema: GenerateAiReplyOutputSchema,
  },
  async (input) => {
    // The flow now calls the strongly-typed prompt.
    // Genkit handles the model invocation, error handling, and JSON parsing.
    const { output } = await replyGeneratorPrompt(input);

    // The output is guaranteed by Genkit to match the Zod schema.
    if (!output) {
      throw new Error("AI failed to generate a valid, structured reply.");
    }
    
    return output;
  }
);


// 4. Public-facing Wrapper Function
// =======================================

/**
 * Fetches business-specific information and then calls the main Genkit flow.
 * This function is exported for use in other parts of the application.
 */
export async function generateAiReply(
  input: Omit<GenerateAiReplyInput, 'businessInfo'>
): Promise<GenerateAiReplyOutput> {
  
  // Fetch business-specific context before calling the flow.
  const clientRef = adminDb.collection('clients').doc(input.clientId);
  const clientSnap = await clientRef.get();

  if (!clientSnap.exists) {
      console.warn(`Client ${input.clientId} not found. Using fallback info for AI prompt.`);
      // Call the flow with fallback data.
      return await generateAiReplyFlow({
          ...input,
          businessInfo: {
              specialOffer: 'a great experience next time',
              contactInfo: 'customer support',
          }
      });
  }
  
  const clientData = clientSnap.data()!;

  const businessInfo = {
    specialOffer: clientData.responseTemplate || 'a great experience next time',
    contactInfo: clientData.email || 'our support team',
  };

  // Call the main flow with all required context.
  const result = await generateAiReplyFlow({ ...input, businessInfo });
  return result;
}
