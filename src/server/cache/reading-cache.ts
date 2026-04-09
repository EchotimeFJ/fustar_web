import { READING_TTL_MS } from "@/lib/constants";
import type { ReadingResult } from "@/types/reading";

type CacheEntry = {
  data: ReadingResult;
  expiresAt: number;
};

const readingCache = new Map<string, CacheEntry>();

function cleanupExpired() {
  const now = Date.now();
  for (const [key, value] of readingCache.entries()) {
    if (value.expiresAt <= now) {
      readingCache.delete(key);
    }
  }
}

export function saveReading(sessionId: string, data: ReadingResult) {
  cleanupExpired();
  readingCache.set(sessionId, {
    data,
    expiresAt: Date.now() + READING_TTL_MS,
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

  return entry.data;
}

export function buildExpiryIso() {
  return new Date(Date.now() + READING_TTL_MS).toISOString();
}
