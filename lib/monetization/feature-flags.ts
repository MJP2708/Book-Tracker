import { getEnv } from "@/lib/env";

const enabledFlags = new Set(
  (process.env.FEATURE_FLAGS ?? "premium_route_guards,premium_ai")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
);

const premiumEmails = new Set(
  (process.env.PREMIUM_USER_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
);

export type FeatureFlag = "premium_route_guards" | "premium_ai" | "affiliate_links";

export function isFeatureEnabled(flag: FeatureFlag) {
  return enabledFlags.has(flag);
}

export function isPremiumEnforced() {
  return process.env.PREMIUM_ENFORCED !== "false";
}

export function isPremiumUserEmail(email?: string | null) {
  if (!email) return false;
  return premiumEmails.has(email.toLowerCase());
}

export function getUpgradeUrl() {
  const env = getEnv();
  return `${env.siteUrl.replace(/\/$/, "")}/pricing`;
}