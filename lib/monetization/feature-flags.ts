import { getEnv } from "@/lib/env";

const enabledFlags = new Set(
  (process.env.FEATURE_FLAGS ?? "premium_route_guards,premium_ai")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
);

export type FeatureFlag = "premium_route_guards" | "premium_ai" | "affiliate_links";

export function isFeatureEnabled(flag: FeatureFlag) {
  return enabledFlags.has(flag);
}

export function isPremiumEnforced() {
  return process.env.PREMIUM_ENFORCED !== "false";
}

export function getUpgradeUrl() {
  const env = getEnv();
  return `${env.siteUrl.replace(/\/$/, "")}/pricing`;
}