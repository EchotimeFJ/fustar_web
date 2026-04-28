import type { ReadingModule } from "@/types/reading";

export const APP_NAME = "福星AI算命";

export const READING_TTL_MS = 1000 * 60 * 15;

export const MODULE_META: Array<Pick<ReadingModule, "key" | "title">> = [
  { key: "chart", title: "命盘总览" },
  { key: "overall", title: "整体格局" },
  { key: "personality", title: "性格与体感" },
  { key: "career", title: "事业匹配" },
  { key: "wealth", title: "财运结构" },
  { key: "marriage", title: "感情婚姻" },
  { key: "health", title: "健康提醒" },
  { key: "advice", title: "当前建议" },
];

export const DISCLAIMER_LINES = [
  "本结果仅供传统文化与娱乐参考，不构成医疗、法律、投资或人生决策建议。",
  "系统不会长期保存你的出生信息；当前结果仅在短时缓存中保留，用于本次浏览。",
  "若涉及现实重大决定，请以专业咨询和个人判断为准。",
];

export const ELEMENT_LABELS = ["木", "火", "土", "金", "水"] as const;

export const TEN_GOD_GROUPS = {
  output: ["食神", "伤官"],
  wealth: ["正财", "偏财"],
  authority: ["正官", "七杀"],
  resource: ["正印", "偏印"],
  peer: ["比肩", "劫财"],
} as const;
