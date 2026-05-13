import { z } from "zod";
import { saveReading } from "@/server/cache/reading-cache";
import { createReading } from "@/server/reading/create-reading";

export const runtime = "nodejs";

const requestSchema = z.object({
  name: z.string().optional(),
  gender: z.enum(["male", "female"]),
  calendarType: z.enum(["solar", "lunar"]).default("solar"),
  birthDate: z.string(),
  birthTime: z.string(),
  birthplace: z.string().optional().default(""),
  captchaToken: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = requestSchema.parse(body);
    
    const captchaResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/captcha/bagua`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: input.captchaToken,
        selectedIndex: -1,
      }),
    });
    
    const captchaResult = await captchaResponse.json();
    
    if (!captchaResult.success) {
      return Response.json({ error: "验证码无效或已过期" }, { status: 400 });
    }
    
    const reading = await createReading(input);
    saveReading(reading.sessionId, reading);

    return Response.json({
      sessionId: reading.sessionId,
      profile: {
        name: reading.profile.name,
        solarText: reading.profile.solarText,
        birthplace: reading.profile.birthplace,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "测算失败，请稍后重试";
    return Response.json({ error: message }, { status: 400 });
  }
}
