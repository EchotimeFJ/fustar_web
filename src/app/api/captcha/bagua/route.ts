import { z } from "zod";

const trigrams = [
  { name: "乾", symbol: "☰", meaning: "天", lines: [1, 1, 1] },
  { name: "兑", symbol: "☱", meaning: "泽", lines: [1, 1, 0] },
  { name: "离", symbol: "☲", meaning: "火", lines: [1, 0, 1] },
  { name: "震", symbol: "☳", meaning: "雷", lines: [1, 0, 0] },
  { name: "巽", symbol: "☴", meaning: "风", lines: [0, 1, 1] },
  { name: "坎", symbol: "☵", meaning: "水", lines: [0, 1, 0] },
  { name: "艮", symbol: "☶", meaning: "山", lines: [0, 0, 1] },
  { name: "坤", symbol: "☷", meaning: "地", lines: [0, 0, 0] },
] as const;

type Trigram = typeof trigrams[number];

interface CaptchaData {
  targetIndex: number;
  expiresAt: number;
  validated: boolean;
}

const store = new Map<string, CaptchaData>();

export async function GET() {
  const targetIndex = Math.floor(Math.random() * trigrams.length);
  const targetTrigram = trigrams[targetIndex];
  
  const token = Math.random().toString(36).substring(2, 15);
  const expiresAt = Date.now() + 5 * 60 * 1000;
  
  store.set(token, { targetIndex, expiresAt, validated: false });
  
  return Response.json({
    token,
    targetTrigram: {
      name: targetTrigram.name,
      symbol: targetTrigram.symbol,
      meaning: targetTrigram.meaning,
    },
    trigrams: trigrams.map((t, index) => ({
      ...t,
      index,
    })),
  });
}

const verifySchema = z.object({
  token: z.string(),
  selectedIndex: z.number().int().min(0).max(7),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, selectedIndex } = verifySchema.parse(body);
    
    const data = store.get(token);
    
    if (!data) {
      return Response.json({ success: false, message: "验证码已过期，请刷新重试" }, { status: 400 });
    }
    
    if (Date.now() > data.expiresAt) {
      store.delete(token);
      return Response.json({ success: false, message: "验证码已过期，请刷新重试" }, { status: 400 });
    }
    
    if (selectedIndex === -1) {
      if (data.validated) {
        store.delete(token);
        return Response.json({ success: true, message: "验证成功" });
      } else {
        return Response.json({ success: false, message: "验证码未完成验证" }, { status: 400 });
      }
    }
    
    const success = data.targetIndex === selectedIndex;
    
    if (success) {
      data.validated = true;
    }
    
    return Response.json({ 
      success, 
      message: success ? "验证成功" : "请点击正确的卦象" 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "验证失败";
    return Response.json({ success: false, message }, { status: 400 });
  }
}