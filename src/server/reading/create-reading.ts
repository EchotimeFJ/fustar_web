import { DISCLAIMER_LINES, TEN_GOD_GROUPS } from "@/lib/constants";
import type {
  ReadingFormInput,
  ReadingPreview,
  ReadingResult,
} from "@/types/reading";
import { buildReadingProfile } from "@/server/bazi/normalize";
import { buildExpiryIso } from "@/server/cache/reading-cache";
import { maybeEnhanceWithOpenRouter } from "@/server/ai/openrouter";
import {
  buildChartModule,
  buildFocusModules,
  normalizeFocusAreas,
} from "./focus-modules";

function sumGroup(counts: Record<string, number>, keys: readonly string[]) {
  return keys.reduce((total, key) => total + (counts[key] || 0), 0);
}

function getCoreAxis(
  authority: number,
  output: number,
  resource: number,
  peer: number,
  wealth: number
) {
  if (authority >= 3 && output >= 2) {
    return "压强驱动型，越在复杂局面越能逼出能力";
  }
  if (resource >= 3 && output >= 2) {
    return "学习理解型，靠认知和表达形成复利";
  }
  if (wealth >= 3) {
    return "现实导向型，对资源、收益和结果非常敏感";
  }
  if (peer >= 3) {
    return "主见很强，适合自己掌握节奏和方法";
  }
  return "平衡型命局，真正的优势在于长期积累和稳定输出";
}

function buildPreview(input: {
  name: string;
  dayMaster: string;
  dayMasterElement: string;
  eightChar: string;
  dominantElements: string[];
  weakerElements: string[];
  tenGodCounts: Record<string, number>;
}): ReadingPreview {
  const authority = sumGroup(input.tenGodCounts, TEN_GOD_GROUPS.authority);
  const output = sumGroup(input.tenGodCounts, TEN_GOD_GROUPS.output);
  const resource = sumGroup(input.tenGodCounts, TEN_GOD_GROUPS.resource);
  const peer = sumGroup(input.tenGodCounts, TEN_GOD_GROUPS.peer);
  const wealth = sumGroup(input.tenGodCounts, TEN_GOD_GROUPS.wealth);
  const stronger = input.dominantElements.join("、");
  const weaker = input.weakerElements.join("、");

  return {
    headline: `${input.name}的命盘属于${getCoreAxis(authority, output, resource, peer, wealth)}`,
    summary: `日主为${input.dayMaster}${input.dayMasterElement}，八字为${input.eightChar}。命局中${stronger}偏显，${weaker}相对偏弱，整体更适合把专业能力、表达能力和长期积累叠加成结果。`,
    bullets: [
      authority >= 3
        ? "命局自带目标感和压力感，适合做要求高、节奏快、需要判断力的事情。"
        : "命局不是靠硬冲取胜，更适合通过方法论和节奏感逐步放大能力。",
      output >= 3
        ? "食伤偏活，适合内容表达、产品化、咨询、培训或把抽象能力变现。"
        : "表达不是唯一卖点，真正的价值更偏向稳定执行与长期输出。",
      wealth >= 3
        ? "对钱和资源天然敏感，越到后期越重视收益结构和主动权。"
        : "财更适合靠职业升级和能力溢价去做，不是纯碰运气型。",
    ],
  };
}

export async function createReading(input: ReadingFormInput): Promise<ReadingResult> {
  const profile = buildReadingProfile(input);
  const sessionId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const focusAreas = normalizeFocusAreas(profile.focusAreas);
  const chartModule = buildChartModule(profile);
  const focusModules = buildFocusModules(profile, focusAreas);

  const draft: ReadingResult = {
    sessionId,
    createdAt,
    expiresAt: buildExpiryIso(),
    preview: buildPreview(profile),
    profile: {
      ...profile,
      focusAreas,
    },
    modules: [chartModule, ...focusModules],
    disclaimer: DISCLAIMER_LINES,
    source: "rule",
  };

  return maybeEnhanceWithOpenRouter(
    {
      ...profile,
      focusAreas,
    },
    draft
  );
}
