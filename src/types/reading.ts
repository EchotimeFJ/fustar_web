export type Gender = "male" | "female";
export type CalendarType = "solar" | "lunar";

export interface ReadingFormInput {
  name?: string;
  gender: Gender;
  calendarType: CalendarType;
  birthDate: string;
  birthTime: string;
  birthplace: string;
  currentJob?: string;
  sideProjects?: string;
  focusAreas?: string[];
}

export interface PillarDetail {
  label: "年柱" | "月柱" | "日柱" | "时柱";
  ganzhi: string;
  wuxing: string;
  nayin: string;
  hiddenStems: string[];
  stemTenGod: string;
  branchTenGods: string[];
}

export interface DecadeLuckItem {
  startAge: number;
  endAge: number;
  ganzhi: string;
}

export interface ReadingProfile {
  name: string;
  gender: Gender;
  genderLabel: string;
  calendarType: CalendarType;
  birthplace: string;
  solarText: string;
  lunarText: string;
  zodiac: string;
  constellation: string;
  age: number;
  dayMaster: string;
  dayMasterElement: string;
  season: string;
  mingGong: string;
  shenGong: string;
  taYuan: string;
  taiXi: string;
  pillars: PillarDetail[];
  eightChar: string;
  wuxingCounts: Record<string, number>;
  dominantElements: string[];
  weakerElements: string[];
  tenGodCounts: Record<string, number>;
  decadeLuck: DecadeLuckItem[];
  currentJob?: string;
  sideProjects?: string;
  focusAreas?: string[];
}

export interface ReadingPreview {
  headline: string;
  summary: string;
  bullets: string[];
}

export interface ReadingModule {
  key:
    | "chart"
    | "overall"
    | "personality"
    | "career"
    | "wealth"
    | "marriage"
    | "health"
    | "advice";
  title: string;
  summary: string;
  paragraphs: string[];
  highlights: string[];
}

export interface ReadingResult {
  sessionId: string;
  createdAt: string;
  expiresAt: string;
  preview: ReadingPreview;
  profile: ReadingProfile;
  modules: ReadingModule[];
  disclaimer: string[];
  source: "rule" | "hybrid-ai";
}
