import { envSchema, type Env } from "./env-schema";

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment variables: ${issues}`);
  }
  return parsed.data;
}

export const env: Env = loadEnv();
export { envSchema, type Env };
