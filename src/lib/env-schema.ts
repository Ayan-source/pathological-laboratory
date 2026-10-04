import { z } from "zod";

const supabaseKey = z
  .string()
  .regex(
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
    "must be a Supabase JWT key (header.payload.signature)",
  );

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z
    .string()
    .regex(/^postgres(ql)?:\/\//, "must be a PostgreSQL connection string"),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey,
  SUPABASE_SERVICE_ROLE_KEY: supabaseKey,
});

export type Env = z.infer<typeof envSchema>;
