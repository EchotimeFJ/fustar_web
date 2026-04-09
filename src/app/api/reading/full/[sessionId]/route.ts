import { getReading } from "@/server/cache/reading-cache";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/reading/full/[sessionId]">
) {
  const { sessionId } = await context.params;
  const reading = getReading(sessionId);

  if (!reading) {
    return Response.json(
      { error: "结果已过期，请重新提交测算。" },
      { status: 404 }
    );
  }

  return Response.json(reading);
}
