import { getServerEnv, hasOpenRouterConfig } from "@/lib/env";
import type { ReadingProfile, ReadingResult } from "@/types/reading";
import { buildAiMessages } from "./prompt";
import { parseAiReadingContent } from "./parser";

export async function maybeEnhanceWithOpenRouter(
  profile: ReadingProfile,
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
        temperature: 0.7,
        messages: buildAiMessages(profile, draft),
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

    const refined = parseAiReadingContent(content);
    return {
      ...draft,
      preview: refined.preview,
      modules: refined.modules,
      source: "hybrid-ai" as const,
    };
  } catch {
    return draft;
  }
}
