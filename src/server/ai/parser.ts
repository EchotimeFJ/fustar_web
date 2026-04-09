import { z } from "zod";

const readingResultSchema = z.object({
  preview: z.object({
    headline: z.string(),
    summary: z.string(),
    bullets: z.array(z.string()).min(2),
  }),
  modules: z.array(
    z.object({
      key: z.enum([
        "chart",
        "overall",
        "personality",
        "career",
        "wealth",
        "marriage",
        "health",
        "advice",
      ]),
      title: z.string(),
      summary: z.string(),
      paragraphs: z.array(z.string()).min(2),
      highlights: z.array(z.string()).min(2),
    })
  ),
});

function stripCodeBlock(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
  }
  return trimmed;
}

export function parseAiReadingContent(text: string) {
  const raw = stripCodeBlock(text);
  const json = JSON.parse(raw);
  return readingResultSchema.parse(json);
}
