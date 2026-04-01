import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/supabase/auth-context";
import { getUpgradeUrl, isFeatureEnabled, isPremiumEnforced } from "@/lib/monetization/feature-flags";

type PremiumApiGuardResult = {
  allowed: boolean;
  userId?: string;
  response?: NextResponse;
};

export async function requireAuthenticatedUserForApi(): Promise<PremiumApiGuardResult> {
  const context = await getAuthContext();

  if (!context) {
    return { allowed: true };
  }

  if (!context.user) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { allowed: true, userId: context.user.id };
}

export async function requirePremiumForApi(): Promise<PremiumApiGuardResult> {
  const context = await getAuthContext();

  if (!context) {
    return { allowed: true };
  }

  if (!context.user) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const premiumCheckEnabled = isFeatureEnabled("premium_ai") && isPremiumEnforced();

  if (premiumCheckEnabled && !context.profile?.premium) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: "Premium subscription required",
          code: "PREMIUM_REQUIRED",
          upgradeUrl: getUpgradeUrl(),
        },
        { status: 402 }
      ),
    };
  }

  return { allowed: true, userId: context.user.id };
}