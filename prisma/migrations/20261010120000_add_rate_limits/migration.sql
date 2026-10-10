-- CreateTable
CREATE TABLE "rate_limits" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("key")
);

-- Only the server (via Prisma) touches this table; block the public Supabase API.
ALTER TABLE "rate_limits" ENABLE ROW LEVEL SECURITY;
