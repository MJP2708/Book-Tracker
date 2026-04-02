import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUpgradeUrl, isFeatureEnabled, isPremiumEnforced, isPremiumUserEmail } from "@/lib/monetization/feature-flags";

type PremiumApiGuardResult = {
  allowed: boolean;
  userId?: string;
  response?: NextResponse;
};

export async function requireAuthenticatedUserForApi(): Promise<PremiumApiGuardResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { allowed: true, userId: session.user.id };
}

export async function requirePremiumForApi(): Promise<PremiumApiGuardResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      allowed: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const premiumCheckEnabled = isFeatureEnabled("premium_ai") && isPremiumEnforced();

  if (premiumCheckEnabled && !isPremiumUserEmail(session.user.email)) {
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

  return { allowed: true, userId: session.user.id };
}