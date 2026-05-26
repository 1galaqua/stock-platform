import { env, isOpenAiConfigured } from "@/lib/env";
import {
  buildBatchSummarySystemPrompt,
  buildStockSummaryPrompt,
  type StockSummaryInput,
} from "@/lib/ai/prompts";

type OpenAiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

function trimSummary(text: string): string {
  return text.replace(/\s+/g, " ").trim().slice(0, 320);
}

export async function generateStockSummary(
  input: StockSummaryInput,
): Promise<string | null> {
  if (!isOpenAiConfigured()) return null;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.openaiModel,
        temperature: 0.4,
        max_tokens: 180,
        messages: [
          { role: "system", content: buildBatchSummarySystemPrompt() },
          { role: "user", content: buildStockSummaryPrompt(input) },
        ],
      }),
    });

    if (!response.ok) {
      console.warn("OpenAI summary request failed", response.status);
      return null;
    }

    const payload = (await response.json()) as OpenAiChatResponse;
    const content = payload.choices?.[0]?.message?.content?.trim();

    return content ? trimSummary(content) : null;
  } catch (error) {
    console.warn("OpenAI summary generation error", error);
    return null;
  }
}

export async function generateStockSummaries(
  inputs: StockSummaryInput[],
  concurrency = 3,
): Promise<Map<string, string>> {
  const summaries = new Map<string, string>();

  if (!isOpenAiConfigured() || inputs.length === 0) {
    return summaries;
  }

  for (let index = 0; index < inputs.length; index += concurrency) {
    const batch = inputs.slice(index, index + concurrency);
    const results = await Promise.all(
      batch.map(async (input) => ({
        ticker: input.entry.ticker,
        summary: await generateStockSummary(input),
      })),
    );

    for (const result of results) {
      if (result.summary) {
        summaries.set(result.ticker, result.summary);
      }
    }
  }

  return summaries;
}
