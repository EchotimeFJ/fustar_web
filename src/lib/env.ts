export function getServerEnv() {
  return {
    openRouterApiKey: process.env.OPENROUTER_API_KEY?.trim() || "",
    openRouterModel:
      process.env.OPENROUTER_MODEL?.trim() || "openai/gpt-4.1-mini",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
  };
}

export function hasOpenRouterConfig() {
  return Boolean(getServerEnv().openRouterApiKey);
}
