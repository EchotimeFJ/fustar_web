import { getServerEnv, hasOpenRouterConfig } from "@/lib/env";
import type { ReadingFormInput, ReadingResult } from "@/types/reading";
import { buildAiMessages } from "./prompt";
import { parseAiReadingContent } from "./parser";

export async function maybeEnhanceWithOpenRouter(
  input: ReadingFormInput,
  draft: ReadingResult
) {
  if (!hasOpenRouterConfig()) {
    return draft;
  }

  const env = getServerEnv();

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.openRouterApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.openRouterModel,
        temperature: 0.9,
        messages: buildAiMessages({
          name: input.name?.trim() || "缘主",
          gender: input.gender,
          calendarType: input.calendarType,
          birthDate: input.birthDate,
          birthTime: input.birthTime,
          birthplace: input.birthplace,
        }),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return draft;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      return draft;
    }

    const parsed = parseAiReadingContent(content);
    return {
      ...draft,
      rawText: parsed.rawText,
      sections: parsed.sections,
      source: "llm" as const,
    };
  } catch {
    return draft;
  }
}
