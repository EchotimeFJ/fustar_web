import type { ReadingProfile, ReadingResult } from "@/types/reading";
import { getFocusPromptGuide } from "@/server/reading/focus-modules";

export function buildAiMessages(profile: ReadingProfile, draft: ReadingResult) {
  const selectedFocuses = getFocusPromptGuide(
    (profile.focusAreas || []).filter(Boolean) as Parameters<typeof getFocusPromptGuide>[0]
  );

  return [
    {
      role: "system",
      content:
        "你是一个中文八字分析助手。你只能输出 JSON，不要输出 Markdown。请严格围绕后端已经定义好的模块结构输出，只能细化和润色这些模块，不能新增、删除或改名模块。要重点响应用户选中的关注类目，不要编造用户未提供的现实经历，不要输出医疗/投资/法律建议，不要写神棍式绝对结论。",
    },
    {
      role: "user",
      content: JSON.stringify(
        {
          task: "refine_bazi_reading",
          profile,
          draft,
          selectedFocuses,
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
