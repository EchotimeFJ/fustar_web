import type { CalendarType, Gender } from "@/types/reading";

type PromptInput = {
  name: string;
  gender: Gender;
  calendarType: CalendarType;
  birthDate: string;
  birthTime: string;
  birthplace: string;
};

function toGenderLabel(gender: Gender) {
  return gender === "male" ? "男" : "女";
}

function toCalendarLabel(calendarType: CalendarType) {
  return calendarType === "solar" ? "公历" : "农历";
}

export function buildAiMessages(input: PromptInput) {
  const birthplaceLabel = input.birthplace.trim();
  const profileLine = birthplaceLabel
    ? `我的名字是${input.name}，性别是${toGenderLabel(input.gender)}，我的${toCalendarLabel(input.calendarType)}出生日期是北京时间下的${input.birthDate} ${input.birthTime}，出生地是${birthplaceLabel}。`
    : `我的名字是${input.name}，性别是${toGenderLabel(input.gender)}，我的${toCalendarLabel(input.calendarType)}出生日期是北京时间下的${input.birthDate} ${input.birthTime}。`;
  const userPrompt = [
    profileLine,
    "请用盲派技巧逐步分析八字，详细测算一生综合运势，事业、财运、婚姻、健康等各方面内容，均需具体细致、全面解读，你可以自我扩宽分析面，但是要确保详细准确，除分析具体八字外，使用通俗易懂且令人信服的文字进行描述。",
  ].join("\n");

  return [
    {
      role: "system",
      content:
        "你是中文八字分析助手。请直接输出详细正文，不要输出 JSON，不要输出代码块。为了便于前端切分展示，请使用 Markdown 一级标题格式分段，也就是每个大段都以 `# 标题` 开头。除了使用一级标题分段之外，不要人为压缩、限制或模板化你的分析结构。",
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];
}
