-- AlterTable
ALTER TABLE "creators" ADD COLUMN "ageRange" TEXT NOT NULL DEFAULT '18-24';
ALTER TABLE "creators" ALTER COLUMN "ageRange" DROP DEFAULT;
ALTER TABLE "creators" DROP COLUMN "dateOfBirth";
