import { describe, expect, it } from "vitest";
import { prisma } from "../../src/lib/db";

describe("database connectivity (SETUP-002)", () => {
  it("connects to Supabase and runs a query", async () => {
    const labSettingsCount = await prisma.labSettings.count();
    expect(labSettingsCount).toBeGreaterThanOrEqual(0);
  }, 15000);

  it("can insert and read back the connection-test row", async () => {
    const row = await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS _connection_test (
        id serial PRIMARY KEY,
        message text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    expect(row).toBeGreaterThanOrEqual(0);

    await prisma.$executeRaw`
      INSERT INTO _connection_test (message) VALUES (${"prisma connected"})
    `;
    const rows = await prisma.$queryRaw<
      { id: number; message: string }[]
    >`SELECT id, message FROM _connection_test ORDER BY id DESC LIMIT 1`;
    expect(rows).toHaveLength(1);
    expect(rows[0].message).toBe("prisma connected");
  }, 15000);
});
