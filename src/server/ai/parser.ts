import type { ReadingSection } from "@/types/reading";

function stripCodeBlock(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```(?:markdown|md|text)?/, "").replace(/```$/, "").trim();
  }
  return trimmed;
}

function isHeading(line: string) {
  return (
    /^#\s+/.test(line) ||
    /^【[^】]{1,20}】$/.test(line) ||
    /^[一二三四五六七八九十百]+[、.．]\s*.+$/.test(line)
  );
}

function extractTitle(line: string) {
  if (/^#\s+/.test(line)) {
    return line.replace(/^#+\s+/, "").trim();
  }
  if (/^【[^】]+】$/.test(line)) {
    return line.replace(/^【/, "").replace(/】$/, "").trim();
  }
  if (/^[一二三四五六七八九十百]+[、.．]\s*.+$/.test(line)) {
    return line.replace(/^[一二三四五六七八九十百]+[、.．]\s*/, "").trim();
  }
  return line.trim();
}

function makeSectionId(title: string, index: number) {
  return `${index + 1}-${title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")}`;
}

export function parseAiReadingContent(text: string) {
  const rawText = stripCodeBlock(text);
  const lines = rawText.split(/\r?\n/);
  const sections: ReadingSection[] = [];

  let currentTitle = "开篇分析";
  let currentLines: string[] = [];

  const flush = () => {
    const content = currentLines.join("\n").trim();
    if (!content) {
      return;
    }
    sections.push({
      id: makeSectionId(currentTitle, sections.length),
      title: currentTitle,
      content,
    });
    currentLines = [];
  };

  for (const originalLine of lines) {
    const line = originalLine.trimEnd();
    if (!line.trim()) {
      currentLines.push("");
      continue;
    }

    if (isHeading(line.trim())) {
      flush();
      currentTitle = extractTitle(line.trim()) || `分析章节 ${sections.length + 1}`;
      continue;
    }

    currentLines.push(line);
  }

  flush();

  if (!sections.length) {
    sections.push({
      id: "1-overall",
      title: "整体分析",
      content: rawText,
    });
  }

  return {
    rawText,
    sections,
  };
}
