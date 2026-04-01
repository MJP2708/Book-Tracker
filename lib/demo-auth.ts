import bcrypt from "bcryptjs";

type DemoAuthUser = {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
};

type DemoAuthState = {
  users: Map<string, DemoAuthUser>;
};

const globalState = globalThis as unknown as { __demoAuthState?: DemoAuthState };

function state(): DemoAuthState {
  if (!globalState.__demoAuthState) {
    globalState.__demoAuthState = { users: new Map<string, DemoAuthUser>() };
  }
  return globalState.__demoAuthState;
}

export async function registerDemoAuthUser(input: { email: string; password: string; name?: string }) {
  const email = input.email.trim().toLowerCase();
  const name = (input.name || email.split("@")[0]).trim();
  if (!email || !input.password) return { ok: false as const, error: "Email and password are required" };

  const s = state();
  if (s.users.has(email)) return { ok: false as const, error: "Email already exists" };

  const passwordHash = await bcrypt.hash(input.password, 10);
  s.users.set(email, {
    email,
    name,
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  return { ok: true as const };
}

export async function verifyDemoAuthUser(emailInput: string, password: string) {
  const email = emailInput.trim().toLowerCase();
  const user = state().users.get(email);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  return { email: user.email, name: user.name };
}

export function getDemoAuthUser(emailInput: string) {
  const email = emailInput.trim().toLowerCase();
  const user = state().users.get(email);
  if (!user) return null;
  return { email: user.email, name: user.name, createdAt: user.createdAt };
}
