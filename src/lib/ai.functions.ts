import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3.6-flash";

const GenerateInput = z.object({
  systemPrompt: z.string().min(1),
  userPrompt: z.string().min(1),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});

function gatewayError(status: number): string {
  if (status === 402)
    return "AI credits are exhausted for this workspace. Add credits in Lovable to keep generating.";
  if (status === 403) return "AI access is blocked by workspace policy.";
  if (status === 429) return "Too many requests right now. Please wait a moment and try again.";
  if (status === 401) return "AI is not configured correctly (missing API key).";
  return "The AI service failed to respond. Please try again.";
}

async function runModel(system: string, messages: { role: "user" | "assistant"; content: string }[]) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const gateway = createLovableAiGatewayProvider(key);

  try {
    const result = streamText({
      model: gateway(MODEL),
      system,
      messages,
    });
    return await result.text;
  } catch (error) {
    const status = (error as { statusCode?: number; status?: number })?.statusCode ??
      (error as { status?: number })?.status ??
      0;
    throw new Error(gatewayError(status));
  }
}

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const text = await runModel(data.systemPrompt, [{ role: "user", content: data.userPrompt }]);
    return { text };
  });

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const text = await runModel(
      "You are an AI workplace productivity assistant for busy professionals. Be concise, practical and well-structured. Use markdown with short headings and bullet points. Never invent facts, figures or citations; say when you are unsure.",
      data.messages,
    );
    return { text };
  });
