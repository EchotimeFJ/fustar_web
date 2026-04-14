import { READING_TTL_MS } from "@/lib/constants";
import type { ReadingResult } from "@/types/reading";

type CacheEntry = {
  data: ReadingResult;
  expiresAt: number;
  pendingReleaseAt: number | null;
};

const readingCache = new Map<string, CacheEntry>();
const RELEASE_GRACE_MS = 1000 * 15;

function cleanupExpired() {
  const now = Date.now();
  for (const [key, value] of readingCache.entries()) {
    if (value.expiresAt <= now || (value.pendingReleaseAt !== null && value.pendingReleaseAt <= now)) {
      readingCache.delete(key);
    }
  }
}

export function saveReading(sessionId: string, data: ReadingResult) {
  cleanupExpired();
  readingCache.set(sessionId, {
    data,
    expiresAt: Date.now() + READING_TTL_MS,
    pendingReleaseAt: null,
  });
}

export function getReading(sessionId: string) {
  cleanupExpired();
  const entry = readingCache.get(sessionId);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    readingCache.delete(sessionId);
    return null;
  }

  if (entry.pendingReleaseAt !== null) {
    entry.pendingReleaseAt = null;
  }

  return entry.data;
}

export function markReadingForRelease(sessionId: string) {
  cleanupExpired();
  const entry = readingCache.get(sessionId);

  if (!entry) {
    return false;
  }

  entry.pendingReleaseAt = Date.now() + RELEASE_GRACE_MS;
  return true;
}

export function buildExpiryIso() {
  return new Date(Date.now() + READING_TTL_MS).toISOString();
}
