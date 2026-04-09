import type { ReadingProfile, ReadingResult } from "@/types/reading";

export function buildAiMessages(profile: ReadingProfile, draft: ReadingResult) {
  return [
    {
      role: "system",
      content:
        "你是一个中文八字分析助手。你只能输出 JSON，不要输出 Markdown。请在保留原有模块结构的基础上，把已有草稿润色得更自然、更具体，但不要编造用户未提供的现实经历，不要输出医疗/投资/法律建议，不要写神棍式绝对结论。",
    },
    {
      role: "user",
      content: JSON.stringify(
        {
          task: "refine_bazi_reading",
          profile,
          draft,
          outputRule: {
            keepSessionFields: true,
            keepModuleKeys: true,
            language: "zh-CN",
            jsonOnly: true,
          },
        },
        null,
        2
      ),
    },
  ];
}
