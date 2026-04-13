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
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = requestSchema.parse(body);
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
