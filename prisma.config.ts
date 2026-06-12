import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: ".env" });
config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Direct (non-pooled) connection, used by the CLI for migrations.
  // The app uses DATABASE_URL (pooled) at runtime via src/lib/prisma.ts.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
