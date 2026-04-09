import { DISCLAIMER_LINES, TEN_GOD_GROUPS } from "@/lib/constants";
import type {
  ReadingFormInput,
  ReadingModule,
  ReadingPreview,
  ReadingProfile,
  ReadingResult,
} from "@/types/reading";
import { buildReadingProfile } from "@/server/bazi/normalize";
import { buildExpiryIso } from "@/server/cache/reading-cache";
import { maybeEnhanceWithOpenRouter } from "@/server/ai/openrouter";

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

function buildPreview(profile: ReadingProfile): ReadingPreview {
  const authority = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.authority);
  const output = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.output);
  const wealth = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.wealth);
  const stronger = profile.dominantElements.join("、");
  const weaker = profile.weakerElements.join("、");

  return {
    headline: `${profile.name}的命盘属于${getCoreAxis(profile)}`,
    summary: `日主为${profile.dayMaster}${profile.dayMasterElement}，八字为${profile.eightChar}。命局中${stronger}偏显，${weaker}相对偏弱，整体更适合把专业能力、表达能力和长期积累叠加成结果。`,
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

function buildModules(profile: ReadingProfile): ReadingModule[] {
  const authority = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.authority);
  const output = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.output);
  const resource = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.resource);
  const wealth = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.wealth);
  const peer = sumGroup(profile.tenGodCounts, TEN_GOD_GROUPS.peer);

  const spouseSignal =
    profile.gender === "female"
      ? authority >= 3
        ? "官杀星有存在感，择偶标准不低，也容易把关系和未来绑定考虑。"
        : "官杀星不算特别抢眼，感情更看现实相处和精神匹配。"
      : wealth >= 3
        ? "财星有力，容易比较在意伴侣的现实能力和共同经营感。"
        : "财星不算外放，感情通常更慢热，进入关系前会先观察。";

  const careerDirection = [
    output >= 3 ? "内容表达、产品化、咨询、培训、IP 化" : null,
    resource >= 3 ? "研究、学习、策略、分析、AI、知识服务" : null,
    authority >= 3 ? "流程复杂、标准高、需要抗压和协同的大组织岗位" : null,
    peer >= 3 ? "自主项目、个人品牌、自由度更高的工作方式" : null,
  ].filter(Boolean) as string[];

  const wealthDirection =
    wealth >= 3
      ? "财的敏感度较高，适合在收入结构上做设计，比如主业 + 服务 + 内容产品，而不是只靠死工资。"
      : "财更像后发型，钱通常不是一开始就猛冲，而是随专业度、位置和议价权一起抬升。";

  const nextLuck = profile.decadeLuck[0]?.ganzhi
    ? `${profile.decadeLuck[0].startAge}-${profile.decadeLuck[0].endAge}岁先走${profile.decadeLuck[0].ganzhi}，之后再进入${profile.decadeLuck[1]?.ganzhi ?? "下一步大运"}。`
    : "大运信息已生成，但更适合在后续版本做逐步细拆。";

  return [
    {
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
    },
    {
      key: "overall",
      title: "整体格局",
      summary: getCoreAxis(profile),
      paragraphs: [
        `这张盘不是纯躺赢型，更像是靠环境压力、目标感和执行力一步步把自己推上去的命。${authority >= 3 ? "官杀/规则压力感较强，说明你不太适合长期处在松散低要求的环境。" : "命局压力感不是最强，但对节奏和秩序依然有要求。"}`,
        `${resource >= 3 ? "印星不弱，说明学习理解能力是你的硬通货，越往后越能靠认知和方法论吃饭。" : "印星不算堆得很厚，所以你更需要通过真实项目和长期实践去建立底气。"}${wealthDirection}`,
        nextLuck,
      ],
      highlights: [
        authority >= 3 ? "有竞争意识和目标压力" : "更适合稳步累积而非盲目冒进",
        output >= 3 ? "表达与输出是加分项" : "核心价值更多在执行和判断",
        resource >= 3 ? "学习转化能力较强" : "需要靠长期训练来沉淀方法论",
      ],
    },
    {
      key: "personality",
      title: "性格与体感",
      summary: "外在表现和内在驱动力都偏明显，不是完全随波逐流的人。",
      paragraphs: [
        `${profile.name}这类命盘通常不是没主意的人。${peer >= 3 ? "比劫偏重，主见强、边界强，不太喜欢别人过度指挥你。" : "虽然不一定嘴上很冲，但心里通常有一套自己的判断标准。"}${output >= 3 ? "食伤有活力时，说话有观点、反应快、适合把复杂东西讲清楚。" : "如果不熟或者状态差，你会偏克制，甚至显得有点冷。"}`,
        `${getBodyTrait(profile)} 这不是医学意义上的外貌预测，而是命理里常见的气质倾向。真正要注意的是：当你太想把事情做到位时，容易把自己绷得很紧。`,
      ],
      highlights: [
        peer >= 3 ? "主见强" : "判断强于讨好",
        output >= 3 ? "表达感强" : "更偏稳和克制",
        authority >= 3 ? "责任心和压强并存" : "更需要自我驱动",
      ],
    },
    {
      key: "career",
      title: "事业匹配",
      summary: "最适合复杂度够高、能够放大认知与表达价值的路径。",
      paragraphs: [
        `你的事业更适合走“专业能力 + 结构化表达 + 长期积累”的路线。${careerDirection.length ? `当前命盘更匹配的方向包括：${careerDirection.join("、")}。` : "最重要的是选择有成长曲线、能持续沉淀方法论的工作环境。"}`,
        `${profile.currentJob ? `你目前提到的主业是“${profile.currentJob}”，从命盘结构看，关键不是是否继续做这份工作，而是能否把它升级成更高杠杆的角色。` : "如果你现在正处在职业选择阶段，优先考虑那些会逼你持续学习、持续升级的方法型岗位。"}${profile.sideProjects ? `副线“${profile.sideProjects}”也很适合作为放大器，用来扩展表达和变现路径。` : "如果有副业，建议优先选能和主业知识复用的方向。"}`,
      ],
      highlights: [
        careerDirection[0] || "适合做复杂业务",
        authority >= 3 ? "能扛高要求环境" : "适合渐进式成长",
        output >= 3 ? "副业可走表达/内容化" : "副业宜走高复用技能",
      ],
    },
    {
      key: "wealth",
      title: "财运结构",
      summary: "钱更像能力与位置抬升后的结果，不是纯碰运气型。",
      paragraphs: [
        `${wealthDirection}${output >= 3 ? "如果把表达、内容、产品化或咨询能力叠加进去，收入结构会比只拿固定工资更有上限。" : "如果一直只守在单一收入来源里，财的放大速度会偏慢。"}`,
        `看财运，不能只看“有没有财星”，还要看你能不能承接。${resource >= 3 ? "你有把认知变现的潜力，关键是别停留在想法层。" : "你更需要通过稳扎稳打的成果来形成议价权。"}真到后期，钱通常跟你的专业稀缺性和主动权一起走。`,
      ],
      highlights: [
        wealth >= 3 ? "有收益意识" : "偏后发型财运",
        output >= 3 ? "适合做第二收入曲线" : "先把主业议价权做高",
        "不建议把运气当主逻辑",
      ],
    },
    {
      key: "marriage",
      title: "感情婚姻",
      summary: "感情判断往往不轻率，真正稳定要看价值观和现实配合。",
      paragraphs: [
        `${spouseSignal}${peer >= 3 ? "你在关系里不太愿意完全失去主导感，所以很看重尊重、边界和沟通方式。" : "你不是一定要压着对方的人，但关系如果长期低质量，你也很难装作没事。"}`,
        `${authority >= 3 ? "命盘里压力感重的人，容易把感情和人生安排一起考虑，所以感情质量好坏会直接影响你的精力状态。" : "感情更像慢热型课题，真正进入关系前，通常会先看稳定度和现实协同。"}适合的对象，最好情绪稳定、逻辑清楚、能沟通，不适合长期反复拉扯型关系。`,
      ],
      highlights: [
        profile.gender === "female" ? "择偶标准不低" : "感情偏观察型",
        peer >= 3 ? "关系里重视边界" : "关系里重视稳定",
        "适合情绪稳定、现实感强的人",
      ],
    },
    {
      key: "health",
      title: "健康提醒",
      summary: "这部分只看结构性倾向，不替代医学判断。",
      paragraphs: [
        `${profile.dominantElements.includes("火") ? "火气偏显时，常见问题是作息被打乱、心火上浮、睡眠质量受影响。" : "命局更怕长期消耗和节律被打乱。"}${profile.dominantElements.includes("土") ? "土重时要注意饮食不规律、脾胃负担和久坐带来的慢性疲劳。" : "若水木偏弱，容易在紧绷时表现为疲惫、恢复慢。"}`,
        `你最该防的不是某个具体病名，而是“忙的时候全靠硬扛”。一旦主业、副业、情绪压力叠在一起，身体会比你想象中更早给信号。`,
      ],
      highlights: [
        "先稳作息，再谈高强度输出",
        "久坐、熬夜、压力叠加时更要留意身体反应",
        "命理提醒不能替代体检和医生建议",
      ],
    },
    {
      key: "advice",
      title: "当前建议",
      summary: "先把确定性能做强，再把放大器接上去。",
      paragraphs: [
        `${profile.focusAreas?.length ? `你当前特别关注：${profile.focusAreas.join("、")}。` : "当前阶段最重要的不是盲目追热点，而是先把真正能复用的核心能力站稳。"}${profile.currentJob ? `围绕“${profile.currentJob}”去做升级，比完全推倒重来更现实。` : "先建立一条能持续投入 2-3 年的主线，会比四处尝试更容易出结果。"}`,
        `${profile.sideProjects ? `副线“${profile.sideProjects}”如果能跟主线形成内容、服务或产品化联动，会比单独散着做更容易放大。` : "如果要做副业，优先选择能复用主业积累、又能形成第二收入结构的方向。"}说得直接一点：你的盘不差，怕的是想得太多、做得太散。`,
      ],
      highlights: [
        "先做强主线，再叠加第二曲线",
        "结果要可复用，别只做一次性努力",
        "避免因为焦虑而频繁换方向",
      ],
    },
  ];
}

export async function createReading(input: ReadingFormInput): Promise<ReadingResult> {
  const profile = buildReadingProfile(input);
  const sessionId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const draft: ReadingResult = {
    sessionId,
    createdAt,
    expiresAt: buildExpiryIso(),
    preview: buildPreview(profile),
    profile,
    modules: buildModules(profile),
    disclaimer: DISCLAIMER_LINES,
    source: "rule",
  };

  return maybeEnhanceWithOpenRouter(profile, draft);
}
