import { Lunar, Solar } from "lunar-javascript";
import { z } from "zod";
import type {
  DecadeLuckItem,
  PillarDetail,
  ReadingFormInput,
  ReadingProfile,
} from "@/types/reading";

const STEM_TO_ELEMENT: Record<string, string> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

type DaYunLike = {
  getGanZhi: () => string;
  getStartAge: () => number;
  getEndAge: () => number;
};

const CONSTELLATIONS = [
  ["摩羯座", 1, 20],
  ["水瓶座", 2, 19],
  ["双鱼座", 3, 21],
  ["白羊座", 4, 20],
  ["金牛座", 5, 21],
  ["双子座", 6, 22],
  ["巨蟹座", 7, 23],
  ["狮子座", 8, 23],
  ["处女座", 9, 23],
  ["天秤座", 10, 24],
  ["天蝎座", 11, 23],
  ["射手座", 12, 22],
  ["摩羯座", 12, 32],
] as const;

const readingInputSchema = z.object({
  name: z.string().trim().max(24).optional(),
  gender: z.enum(["male", "female"]),
  calendarType: z.enum(["solar", "lunar"]).default("solar"),
  birthDate: z.string(),
  birthTime: z.string(),
  birthplace: z.string().trim().max(80).default(""),
  currentJob: z.string().trim().max(80).optional(),
  sideProjects: z.string().trim().max(200).optional(),
  focusAreas: z.array(z.string().trim().min(1).max(30)).max(6).optional(),
}).transform((input) => ({
  ...input,
  birthDate: normalizeBirthDate(input.birthDate, input.calendarType),
  birthTime: normalizeBirthTime(input.birthTime),
}));

function normalizeDigits(value: string) {
  return value.replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 65248));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function getSolarDayCount(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function normalizeBirthDate(rawValue: string, calendarType: "solar" | "lunar") {
  const cleaned = normalizeDigits(rawValue)
    .trim()
    .replace(/[./]/g, "-")
    .replace(/[年/月]/g, "-")
    .replace(/[日号]/g, "")
    .replace(/\s+/g, "");
  const parts = cleaned.match(/\d+/g) ?? [];

  const year = clamp(Number(parts[0]) || 2000, 1900, 2099);
  const month = clamp(Number(parts[1]) || 1, 1, 12);
  const maxDay = calendarType === "solar" ? getSolarDayCount(year, month) : 30;
  const day = clamp(Number(parts[2]) || 1, 1, maxDay);

  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function normalizeBirthTime(rawValue: string) {
  const cleaned = normalizeDigits(rawValue)
    .trim()
    .replace(/[：时点]/g, ":")
    .replace(/[分]/g, "")
    .replace(/\s+/g, "");
  const parts = cleaned.match(/\d+/g) ?? [];

  const hour = clamp(Number(parts[0]) || 0, 0, 23);
  const minute = clamp(Number(parts[1]) || 0, 0, 59);

  return `${pad2(hour)}:${pad2(minute)}`;
}

function getConstellation(month: number, day: number) {
  const matched = CONSTELLATIONS.find((item) => {
    const [, m, d] = item;
    return month < m || (month === m && day < d);
  });

  return matched?.[0] ?? "摩羯座";
}

function getAge(year: number, month: number, day: number) {
  const now = new Date();
  let age = now.getFullYear() - year;
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  if (currentMonth < month || (currentMonth === month && currentDay < day)) {
    age -= 1;
  }

  return age;
}

function countFromPairs(pairs: string[]) {
  const counts: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const pair of pairs) {
    for (const char of pair) {
      if (counts[char] !== undefined) {
        counts[char] += 1;
      }
    }
  }
  return counts;
}

function countTenGod(values: Array<string | string[]>) {
  const counts: Record<string, number> = {};
  values.flat().forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
  });
  return counts;
}

function sortElements(counts: Record<string, number>) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([element]) => element);
}

function buildPillar(
  label: PillarDetail["label"],
  ganzhi: string,
  wuxing: string,
  nayin: string,
  hiddenStems: string[],
  stemTenGod: string,
  branchTenGods: string[]
): PillarDetail {
  return {
    label,
    ganzhi,
    wuxing,
    nayin,
    hiddenStems,
    stemTenGod,
    branchTenGods,
  };
}

export function normalizeReadingInput(input: ReadingFormInput) {
  return readingInputSchema.parse(input);
}

export function buildReadingProfile(input: ReadingFormInput): ReadingProfile {
  const parsed = normalizeReadingInput(input);
  const [year, month, day] = parsed.birthDate.split("-").map(Number);
  const [hour, minute] = parsed.birthTime.split(":").map(Number);

  const lunar =
    parsed.calendarType === "solar"
      ? Solar.fromYmdHms(year, month, day, hour, minute, 0).getLunar()
      : Lunar.fromYmdHms(year, month, day, hour, minute, 0);

  const solar = lunar.getSolar();
  const eightChar = lunar.getEightChar();
  const yun = eightChar.getYun(parsed.gender === "male" ? 1 : 0);

  const pillars = [
    buildPillar(
      "年柱",
      eightChar.getYear(),
      eightChar.getYearWuXing(),
      eightChar.getYearNaYin(),
      eightChar.getYearHideGan(),
      eightChar.getYearShiShenGan(),
      eightChar.getYearShiShenZhi()
    ),
    buildPillar(
      "月柱",
      eightChar.getMonth(),
      eightChar.getMonthWuXing(),
      eightChar.getMonthNaYin(),
      eightChar.getMonthHideGan(),
      eightChar.getMonthShiShenGan(),
      eightChar.getMonthShiShenZhi()
    ),
    buildPillar(
      "日柱",
      eightChar.getDay(),
      eightChar.getDayWuXing(),
      eightChar.getDayNaYin(),
      eightChar.getDayHideGan(),
      eightChar.getDayShiShenGan(),
      eightChar.getDayShiShenZhi()
    ),
    buildPillar(
      "时柱",
      eightChar.getTime(),
      eightChar.getTimeWuXing(),
      eightChar.getTimeNaYin(),
      eightChar.getTimeHideGan(),
      eightChar.getTimeShiShenGan(),
      eightChar.getTimeShiShenZhi()
    ),
  ];

  const wuxingCounts = countFromPairs([
    eightChar.getYearWuXing(),
    eightChar.getMonthWuXing(),
    eightChar.getDayWuXing(),
    eightChar.getTimeWuXing(),
  ]);

  const sortedElements = sortElements(wuxingCounts);
  const tenGodCounts = countTenGod([
    eightChar.getYearShiShenGan(),
    eightChar.getYearShiShenZhi(),
    eightChar.getMonthShiShenGan(),
    eightChar.getMonthShiShenZhi(),
    eightChar.getDayShiShenZhi(),
    eightChar.getTimeShiShenGan(),
    eightChar.getTimeShiShenZhi(),
  ]);

  const decadeLuck: DecadeLuckItem[] = (yun.getDaYun(7) as DaYunLike[])
    .filter((item) => item.getGanZhi())
    .map((item) => ({
      startAge: item.getStartAge(),
      endAge: item.getEndAge(),
      ganzhi: item.getGanZhi(),
    }));

  const solarYear = solar.getYear();
  const solarMonth = solar.getMonth();
  const solarDay = solar.getDay();

  return {
    name: parsed.name || "缘主",
    gender: parsed.gender,
    genderLabel: parsed.gender === "male" ? "男" : "女",
    calendarType: parsed.calendarType,
    birthplace: parsed.birthplace || "未填写",
    solarText: `${solar.getYear()}-${String(solar.getMonth()).padStart(2, "0")}-${String(solar.getDay()).padStart(2, "0")} ${String(solar.getHour()).padStart(2, "0")}:${String(solar.getMinute()).padStart(2, "0")}`,
    lunarText: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} ${lunar.getTimeInGanZhi()}时`,
    zodiac: lunar.getYearShengXiaoExact(),
    constellation: getConstellation(solarMonth, solarDay),
    age: getAge(solarYear, solarMonth, solarDay),
    dayMaster: eightChar.getDayGan(),
    dayMasterElement: STEM_TO_ELEMENT[eightChar.getDayGan()] || "土",
    season: lunar.getSeason(),
    mingGong: eightChar.getMingGong(),
    shenGong: eightChar.getShenGong(),
    taYuan: eightChar.getTaiYuan(),
    taiXi: eightChar.getTaiXi(),
    pillars,
    eightChar: pillars.map((pillar) => pillar.ganzhi).join(" "),
    wuxingCounts,
    dominantElements: sortedElements.slice(0, 2),
    weakerElements: sortedElements.slice(-2),
    tenGodCounts,
    decadeLuck,
    currentJob: parsed.currentJob,
    sideProjects: parsed.sideProjects,
    focusAreas: parsed.focusAreas,
  };
}
