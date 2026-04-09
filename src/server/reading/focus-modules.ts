import { DEFAULT_FOCUS_OPTIONS, FOCUS_OPTIONS } from "@/lib/form-options";
import { TEN_GOD_GROUPS } from "@/lib/constants";
import type { ReadingModule, ReadingProfile } from "@/types/reading";

export type FocusLabel = (typeof FOCUS_OPTIONS)[number];

type FocusModuleDefinition = {
  key: string;
  title: string;
  promptHint: string;
  build: (profile: ReadingProfile) => Omit<ReadingModule, "key" | "title">;
};

function sumGroup(counts: Record<string, number>, keys: readonly string[]) {
  return keys.reduce((total, key) => total + (counts[key] || 0), 0);
}

function getCoreAxis(profile: ReadingProfile) {
  const authority = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.authority);
  const output = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.output);
  const resource = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.resource);
  const peer = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.peer);
  const wealth = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.wealth);

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

function getBodyTrait(profile: ReadingProfile) {
  if (profile.dominantElements.includes("金")) {
    return "气质偏利落，审美和边界感较强，容易给人一种干净、理性、不太好糊弄的感觉。";
  }
  if (profile.dominantElements.includes("火")) {
    return "人会有存在感和行动力，状态好时很有感染力，状态差时也容易显得急。";
  }
  if (profile.dominantElements.includes("土")) {
    return "整体偏稳，别人会觉得你有定力、有现实感，但有时也会显得太硬。";
  }
  if (profile.dominantElements.includes("木")) {
    return "看上去会有成长感和延展感，容易给人有想法、愿意向上走的印象。";
  }
  return "思维偏活，反应不慢，给人感受通常是聪明、敏感、带一点距离感。";
}

function getCareerDirection(profile: ReadingProfile) {
  const authority = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.authority);
  const output = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.output);
  const resource = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.resource);
  const peer = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.peer);

  return [
    output >= 3 ? "内容表达、产品化、咨询、培训、IP 化" : null,
    resource >= 3 ? "研究、学习、策略、分析、AI、知识服务" : null,
    authority >= 3 ? "流程复杂、标准高、需要抗压和协同的大组织岗位" : null,
    peer >= 3 ? "自主项目、个人品牌、自由度更高的工作方式" : null,
  ].filter(Boolean) as string[];
}

function getSpouseSignal(profile: ReadingProfile) {
  const authority = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.authority);
  const wealth = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.wealth);

  return profile.gender === "female"
    ? authority >= 3
      ? "官杀星有存在感，择偶标准不低，也容易把关系和未来绑定考虑。"
      : "官杀星不算特别抢眼，感情更看现实相处和精神匹配。"
    : wealth >= 3
      ? "财星有力，容易比较在意伴侣的现实能力和共同经营感。"
      : "财星不算外放，感情通常更慢热，进入关系前会先观察。";
}

function getNextLuck(profile: ReadingProfile) {
  return profile.decadeLuck[0]?.ganzhi
    ? `${profile.decadeLuck[0].startAge}-${profile.decadeLuck[0].endAge}岁先走${profile.decadeLuck[0].ganzhi}，之后再进入${profile.decadeLuck[1]?.ganzhi ?? "下一步大运"}。`
    : "大运信息已生成，但更适合在后续版本做逐步细拆。";
}

export function buildChartModule(profile: ReadingProfile): ReadingModule {
  return {
    key: "chart",
    title: "命盘总览",
    summary: `八字为${profile.eightChar}，日主为${profile.dayMaster}${profile.dayMasterElement}。`,
    paragraphs: [
      `你的四柱依次是 ${profile.pillars.map((pillar) => `${pillar.label}${pillar.ganzhi}`).join("、")}。从结构上看，${profile.dominantElements.join("、")}更显，${profile.weakerElements.join("、")}相对偏弱，所以看命不能只盯一个点，而是要看你如何把长板放大。`,
      `命宫${profile.mingGong}、身宫${profile.shenGong}，胎元${profile.taYuan}、胎息${profile.taiXi}。这类盘最怕的是方向太散、心里太急；最值钱的是把专业、节奏和长期积累变成稳定输出。`,
    ],
    highlights: [
      `生肖：${profile.zodiac}`,
      `星座：${profile.constellation}`,
      `当前年龄：${profile.age}岁`,
      `五行分布：${Object.entries(profile.wuxingCounts)
        .map(([key, value]) => `${key}${value}`)
        .join(" / ")}`,
    ],
  };
}

const focusModuleDefinitions: Record<FocusLabel, FocusModuleDefinition> = {
  一生运势: {
    key: "life_overall",
    title: "一生运势",
    promptHint: "从命局整体格局、人生节奏、起伏特点和后劲判断一生运势，不要只给空泛吉凶。",
    build: (profile) => ({
      summary: getCoreAxis(profile),
      paragraphs: [
        `这张盘不是纯躺赢型，更像是靠环境压力、目标感和执行力一步步把自己推上去的命。命局真正的优势，是把认知、方法和稳定输出不断叠加。`,
        `从人生节奏看，${getNextLuck(profile)} 很多关键变化不是凭空发生，而是你能力与外界机会逐渐对上之后的自然抬升。`,
      ],
      highlights: ["不是纯享福型", "更看后劲和积累", "关键在于别把方向做散"],
    }),
  },
  性格底色: {
    key: "personality_core",
    title: "性格底色",
    promptHint: "重点分析内在驱动力、情绪模式、做事方式、优点和硬伤。",
    build: (profile) => {
      const authority = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.authority);
      const output = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.output);
      const peer = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.peer);
      return {
        summary: "不是没想法的人，通常内心判断很强。",
        paragraphs: [
          `${profile.name}这类命盘通常不是没主意的人。${peer >= 3 ? "主见强、边界强，不太喜欢别人过度指挥你。" : "虽然不一定嘴上很冲，但心里通常有一套自己的判断标准。"}${output >= 3 ? "食伤有活力时，说话有观点、反应快、适合把复杂东西讲清楚。" : "如果不熟或者状态差，你会偏克制，甚至显得有点冷。"}`,
          `${authority >= 3 ? "责任心和压强并存，所以你会很在意自己做得是否像样。" : "你并不是靠外界推着走的人，更需要找到能长期认同的方向。"}真正的硬伤是想得太多、标准太高时，容易把自己绷得很紧。`,
        ],
        highlights: [peer >= 3 ? "主见强" : "判断力强", output >= 3 ? "表达能力可放大" : "偏克制稳住", authority >= 3 ? "责任感高" : "更靠自驱"],
      };
    },
  },
  体貌气质: {
    key: "appearance_style",
    title: "体貌气质",
    promptHint: "分析高概率的体貌、气质、给人的第一印象，不要写医学化或绝对化描述。",
    build: (profile) => ({
      summary: "看起来往往有自己的气场，不是毫无存在感的类型。",
      paragraphs: [
        `${getBodyTrait(profile)} 这种判断更偏气质和外在观感，不是精确到五官的硬预测。`,
        `一般来说，你给人的第一印象会偏向“有分寸、脑子在线、不是太好糊弄”。如果状态不好，则容易显得疏离、没耐心或压迫感稍强。`,
      ],
      highlights: ["偏看整体气质", "容易显得有边界", "状态会直接写在气场里"],
    }),
  },
  家庭与早年: {
    key: "family_early",
    title: "家庭与早年",
    promptHint: "看家庭氛围、早年成长、是否早熟、是否容易被要求和比较。",
    build: () => ({
      summary: "早年更像在要求和比较里长出来，而不是完全随意生长。",
      paragraphs: [
        `这类命盘通常小时候就会比较早熟，或者更早意识到“我得表现得像样”。家庭不一定天天高压，但对你往往是有期待、有标准、有比较感的。`,
        `早年经历对你最大的塑形，不是单次事件，而是让你更早建立责任感和判断力。好处是成熟得快，问题是容易比同龄人更早进入自我要求高的状态。`,
      ],
      highlights: ["容易早熟", "对自己要求偏高", "成长中的比较感较强"],
    }),
  },
  学业考试: {
    key: "study_exam",
    title: "学业考试",
    promptHint: "分析学习模式、考试心态、适合的学习路径和易踩的坑。",
    build: (profile) => {
      const resource = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.resource);
      const output = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.output);
      return {
        summary: resource >= 3 ? "理解力和吸收力不错，学得进去时进步会很快。" : "学习更依赖节奏与方法，而不是纯天赋硬吃。",
        paragraphs: [
          `${resource >= 3 ? "印星不弱，说明你不是单纯靠刷题的人，往往更适合理解型学习。" : "如果方法不对，你会觉得学得很累；一旦找对方法，提升反而会明显。"}${output >= 3 ? "再加上表达能力，适合把复杂知识讲明白。" : "所以考试阶段最重要的是稳定度和执行力。"}`,
          `学业和考试里最怕的不是不会，而是心态起伏、标准过高、临场绷得太紧。你真正要做的是把学习变成一个可重复的方法，而不是靠情绪波动冲刺。`,
        ],
        highlights: [resource >= 3 ? "偏理解型学习" : "偏方法型学习", output >= 3 ? "讲题与输出有优势" : "重稳定执行", "别让压力拖累发挥"],
      };
    },
  },
  事业发展: {
    key: "career_growth",
    title: "事业发展",
    promptHint: "分析职业主线、事业节奏、适合怎样升级，而不是笼统说适合上班还是创业。",
    build: (profile) => {
      const directions = getCareerDirection(profile);
      return {
        summary: "最适合复杂度够高、能放大认知与表达价值的路径。",
        paragraphs: [
          `你的事业更适合走“专业能力 + 结构化表达 + 长期积累”的路线。${directions.length ? `当前命盘更匹配的方向包括：${directions.join("、")}。` : "最重要的是选择有成长曲线、能持续沉淀方法论的工作环境。"}`,
          `事业真正的上升，不只是换一份工作，而是不断把你在系统内的位置、方法论和议价权往上提。越往后，越不适合长期停留在低替代门槛的位置。`,
        ],
        highlights: [directions[0] || "适合复杂业务", "职业升级比盲目转行更重要", "越到后期越看议价权"],
      };
    },
  },
  适合行业: {
    key: "fit_industry",
    title: "适合行业",
    promptHint: "分析更匹配的行业和工作环境，以及明显不适合长期待的环境。",
    build: (profile) => {
      const directions = getCareerDirection(profile);
      return {
        summary: "不是任何行业都一样，真正适合的是有复杂度、有门槛、有成长曲线的方向。",
        paragraphs: [
          `${directions.length ? `从命盘看，你更适合：${directions.join("、")}。` : "命盘本身更适合需要理解力、协同力和复盘能力的工作。"}这些方向能让你把脑力、判断和长期积累做成复利。`,
          `明显不适合长期深扎的环境，是纯机械重复、完全靠情绪劳动、或者主要靠低水平人情关系运转的地方。你会越做越烦，时间久了还容易怀疑自己。`,
        ],
        highlights: ["适合高复杂度方向", "不适合纯低门槛重复", "工作环境要能沉淀方法"],
      };
    },
  },
  副业机会: {
    key: "side_hustle",
    title: "副业机会",
    promptHint: "看副业适配度、变现方式和与主线的协同，不要只写‘适合做副业’。",
    build: (profile) => {
      const output = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.output);
      const resource = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.resource);
      return {
        summary: output >= 3 ? "副业更适合走内容、表达、产品化和咨询型路径。" : "副业更适合跟主业能力共用底层方法，而不是完全割裂。",
        paragraphs: [
          `${output >= 3 ? "食伤偏活，说明你不只是适合干活，也适合把经验讲出来、做成服务、产品或内容。" : "副业要想跑出来，关键不是跟风，而是找一个能复用你原有积累的切口。"}`,
          `${resource >= 3 ? "如果你的副业能承接学习、研究、知识整理和结构化输出，后劲会比较足。" : "副业别开太多条线，最怕什么都沾一点，最后没有一个形成真正现金流。"}`,
        ],
        highlights: [output >= 3 ? "适合表达型副业" : "适合主业协同型副业", "不要做得太散", "优先找能复用能力的方向"],
      };
    },
  },
  财富: {
    key: "wealth",
    title: "财富",
    promptHint: "把财富作为独立模块，重点看财富结构、赚钱上限、收入抬升方式和风险。",
    build: (profile) => {
      const wealth = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.wealth);
      const output = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.output);
      const resource = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.resource);
      return {
        summary: wealth >= 3 ? "财感不弱，钱这件事会越来越成为你人生的重要议题。" : "财富偏后发，钱不是一下子砸下来，而是跟着能力和位置一起抬。",
        paragraphs: [
          `${wealth >= 3 ? "你对资源、收益、回报率的感觉会比较敏感，越到后期越不满足于只拿固定工资。" : "这类命盘的钱通常不是一夜爆出来，而是随着专业度、项目权重和议价权一步步做上去。"}`,
          `${output >= 3 ? "如果能把表达、内容、产品化或咨询能力叠加进去，财富上限会比只守着一条工资线更高。" : "如果一直只守在单一收入来源里，财的放大速度会偏慢。"}${resource >= 3 ? "你有把认知和方法论变现的潜力，关键是别停留在想法层。" : "财富真正的突破，还是要靠结果和可复用能力。"}`,
        ],
        highlights: [wealth >= 3 ? "收益意识强" : "偏后发型财运", output >= 3 ? "适合第二收入曲线" : "先抬高主业议价权", "别把运气当主逻辑"],
      };
    },
  },
  赚钱方式: {
    key: "money_method",
    title: "赚钱方式",
    promptHint: "重点看靠什么方式挣钱更顺，是工资、项目、服务、内容、管理还是组合型。",
    build: (profile) => {
      const output = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.output);
      const resource = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.resource);
      const wealth = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.wealth);
      return {
        summary: "更适合组合型赚钱，不适合把自己锁死在单一模式里。",
        paragraphs: [
          `${wealth >= 3 ? "钱更适合通过岗位升级、资源整合和项目结果来放大。" : "基础盘面更适合先靠专业度、稳定输出和长期信用来挣钱。"}${output >= 3 ? "再往上走，可以把表达、服务、内容、产品化这些方式叠加进去。" : "等主业能力站稳后，再考虑第二曲线会更稳。"}`,
          `${resource >= 3 ? "你并不只是适合卖时间，也适合卖方法、卖结构、卖解决方案。" : "要避免一直停留在被动接活模式里，赚钱方式要逐渐从体力型转向方法型。"}`,
        ],
        highlights: ["适合组合型收入", output >= 3 ? "可做服务/内容/产品" : "先从主业成果切入", "从卖时间逐步升级到卖方法"],
      };
    },
  },
  婚姻感情: {
    key: "marriage",
    title: "婚姻感情",
    promptHint: "把婚姻感情作为独立模块，重点分析关系模式、择偶标准、相处矛盾和适合对象。",
    build: (profile) => {
      const authority = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.authority);
      const peer = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.peer);
      return {
        summary: "感情判断往往不轻率，真正稳定要看价值观和现实配合。",
        paragraphs: [
          `${getSpouseSignal(profile)}${peer >= 3 ? "你在关系里不太愿意完全失去主导感，所以很看重尊重、边界和沟通方式。" : "你不是一定要压着对方的人，但关系如果长期低质量，你也很难装作没事。"}`,
          `${authority >= 3 ? "命盘里压力感重的人，容易把感情和人生安排一起考虑，所以感情质量好坏会直接影响你的精力状态。" : "感情更像慢热型课题，真正进入关系前，通常会先看稳定度和现实协同。"}适合的对象，最好情绪稳定、逻辑清楚、能沟通，不适合长期反复拉扯型关系。`,
        ],
        highlights: [profile.gender === "female" ? "择偶标准不低" : "感情偏观察型", peer >= 3 ? "关系里重视边界" : "关系里重视稳定", "适合情绪稳定、现实感强的人"],
      };
    },
  },
  正缘时间: {
    key: "timing_love",
    title: "正缘时间",
    promptHint: "结合大运与关系节奏，判断更容易认真进入关系的窗口感，而不是绝对年份预言。",
    build: (profile) => ({
      summary: "正缘时间更适合看窗口，不适合当成死板年份。",
      paragraphs: [
        `${getNextLuck(profile)} 感情窗口通常跟个人事业节奏、生活状态和大运变化绑在一起，不是单独飞出来的。`,
        `真正容易进入稳定关系的时候，往往是你自我节奏更稳、对伴侣要求更清楚、生活现实面也愿意一起承担的时候。与其死盯一个年份，不如看你是否进入了“愿意认真经营关系”的状态。`,
      ],
      highlights: ["看窗口而非死年份", "感情与事业节奏会联动", "越成熟越容易进入稳定关系"],
    }),
  },
  健康: {
    key: "health",
    title: "健康",
    promptHint: "把健康作为独立模块，只看结构性风险与生活习惯提醒，不做医学诊断。",
    build: (profile) => ({
      summary: "这部分只看结构性倾向，不替代医学判断。",
      paragraphs: [
        `${profile.dominantElements.includes("火") ? "火气偏显时，常见问题是作息被打乱、心火上浮、睡眠质量受影响。" : "命局更怕长期消耗和节律被打乱。"}${profile.dominantElements.includes("土") ? "土重时要注意饮食不规律、脾胃负担和久坐带来的慢性疲劳。" : "若水木偏弱，容易在紧绷时表现为疲惫、恢复慢。"}`,
        `你最该防的不是某个具体病名，而是“忙的时候全靠硬扛”。一旦主业、副业、情绪压力叠在一起，身体会比你想象中更早给信号。`,
      ],
      highlights: ["先稳作息，再谈高强度输出", "久坐、熬夜、压力叠加时更要留意身体反应", "命理提醒不能替代体检和医生建议"],
    }),
  },
  近三年走势: {
    key: "three_year_trend",
    title: "近三年走势",
    promptHint: "从当前年龄所处阶段和当前大运，判断近三年适合冲什么、稳什么、避什么。",
    build: (profile) => ({
      summary: "近三年更像承上启下的阶段，重点是顺着节奏放大，而不是乱换方向。",
      paragraphs: [
        `${getNextLuck(profile)} 近三年最值得关注的，不只是会不会有机会，而是你是否在正确的主线里积累可复用资产。`,
        `如果当前正在做的重要事情能持续沉淀成果、口碑、作品、项目经验，那么这三年往往会逐步体现出复利。相反，如果频繁换方向，结果就容易被自己打散。`,
      ],
      highlights: ["近三年重点看复利", "先稳主线再放大", "避免因为焦虑反复换方向"],
    }),
  },
  大运转折: {
    key: "decade_turning",
    title: "大运转折",
    promptHint: "分析大运阶段转换的意义，强调人生主题变化和该怎么接。",
    build: (profile) => ({
      summary: "大运转折本质上是人生主题切换，不只是好坏。",
      paragraphs: [
        `${getNextLuck(profile)} 每一步大运代表你接下来更容易遇到的主问题：有的运更偏事业，有的更偏财富，有的更偏关系和重组。`,
        `真正厉害的人，不是等好运来，而是提前理解运势主题变化，先把自己的能力模型、收入结构和关系边界准备好。这样到了转折点，才不会被动。`,
      ],
      highlights: ["运势是主题切换", "提前布局比临时反应更重要", "大运转折常常伴随选择题"],
    }),
  },
  当前最该注意什么: {
    key: "current_advice",
    title: "当前最该注意什么",
    promptHint: "结合用户当前阶段，给出最现实、最直接、最不绕弯的提醒。",
    build: (profile) => ({
      summary: "先把确定性能做强，再把放大器接上去。",
      paragraphs: [
        `${profile.focusAreas?.length ? `你当前特别关注：${profile.focusAreas.join("、")}。` : "当前阶段最重要的不是盲目追热点，而是先把真正能复用的核心能力站稳。"}说得直接一点：你的盘不差，怕的是想得太多、做得太散。`,
        `你现在最该注意的是，不要因为一时焦虑而把长期复利打断。先把真正重要的主线做强，再考虑副线和扩张，效果会明显好很多。`,
      ],
      highlights: ["别把主线做散", "确定性先于幻想", "长期复利比短期情绪更重要"],
    }),
  },
};

export function normalizeFocusAreas(input?: string[]) {
  const allowed = new Set<string>(FOCUS_OPTIONS);
  const deduped = (input || [])
    .map((item) => item.trim())
    .filter((item): item is FocusLabel => Boolean(item) && allowed.has(item));

  return (deduped.length ? [...new Set(deduped)] : [...DEFAULT_FOCUS_OPTIONS]) as FocusLabel[];
}

export function buildFocusModules(profile: ReadingProfile, focuses: FocusLabel[]) {
  return focuses.map((focus) => {
    const definition = focusModuleDefinitions[focus];
    return {
      key: definition.key,
      title: definition.title,
      ...definition.build(profile),
    } satisfies ReadingModule;
  });
}

export function getFocusPromptGuide(focuses: FocusLabel[]) {
  return focuses.map((focus) => ({
    label: focus,
    key: focusModuleDefinitions[focus].key,
    title: focusModuleDefinitions[focus].title,
    promptHint: focusModuleDefinitions[focus].promptHint,
  }));
}
