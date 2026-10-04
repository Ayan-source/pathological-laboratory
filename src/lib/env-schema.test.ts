import { describe, expect, it } from "vitest";
import { envSchema } from "./env-schema";

const validEnv = {
  NODE_ENV: "test" as const,
  DATABASE_URL: "postgresql://user:pass@localhost:5432/postgres",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiJ9.signature123",
  SUPABASE_SERVICE_ROLE_KEY:
    "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.signature456",
};

describe("envSchema", () => {
  it("accepts a valid environment", () => {
    const result = envSchema.safeParse(validEnv);
    expect(result.success).toBe(true);
  });

  it("rejects a missing DATABASE_URL", () => {
    const result = envSchema.safeParse({ ...validEnv, DATABASE_URL: undefined });
    expect(result.success).toBe(false);
  });

  it("rejects non-postgreSQL DATABASE_URL", () => {
    const result = envSchema.safeParse({
      ...validEnv,
      DATABASE_URL: "mysql://user:pass@localhost:3306/db",
    });
    expect(result.success).toBe(false);
  });

  it("rejects placeholder Supabase keys", () => {
    const result = envSchema.safeParse({
      ...validEnv,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "REPLACE_WITH_ANON_KEY",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid Supabase URL", () => {
    const result = envSchema.safeParse({
      ...validEnv,
      NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("defaults NODE_ENV to development", () => {
    const result = envSchema.safeParse({ ...validEnv, NODE_ENV: undefined });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.NODE_ENV).toBe("development");
  });
});
