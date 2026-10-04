import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("FAILED: DATABASE_URL missing from .env");
  process.exit(1);
}

const client = new Client({ connectionString: url });

try {
  await client.connect();
  await client.query(
    "CREATE TABLE IF NOT EXISTS _connection_test (id serial PRIMARY KEY, message text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())",
  );
  const inserted = await client.query(
    "INSERT INTO _connection_test (message) VALUES ($1) RETURNING *",
    ["supabase connected"],
  );
  console.log("OK - Supabase reachable. Dummy row:", inserted.rows[0]);
} catch (err) {
  console.error("FAILED:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
