-- CreateEnum
CREATE TYPE "CreatorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "creators" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "hourlyRate" DECIMAL(10,2) NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "frontFacePath" TEXT NOT NULL,
    "sideFacePath" TEXT NOT NULL,
    "status" "CreatorStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creators_pkey" PRIMARY KEY ("id")
);
