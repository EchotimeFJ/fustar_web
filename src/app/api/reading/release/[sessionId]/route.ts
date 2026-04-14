import { markReadingForRelease } from "@/server/cache/reading-cache";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/reading/release/[sessionId]">
) {
  const { sessionId } = await context.params;
  const queued = markReadingForRelease(sessionId);

  return Response.json({ ok: true, queued });
}
