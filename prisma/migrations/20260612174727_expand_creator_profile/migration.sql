/*
  Warnings:

  - You are about to drop the column `age` on the `creators` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `creators` table. All the data in the column will be lost.
  - You are about to drop the column `hourlyRate` on the `creators` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `creators` table. All the data in the column will be lost.
  - Added the required column `audienceAgeGroup` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audienceGenderSplit` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audienceTopCountries` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bio` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoicingAs` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lifestylePath` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryNiche` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialPlatforms` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vatStatus` to the `creators` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `creators` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `creators` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "creators" DROP COLUMN "age",
DROP COLUMN "fullName",
DROP COLUMN "hourlyRate",
DROP COLUMN "nationality",
ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "agentContact" TEXT,
ADD COLUMN     "agentName" TEXT,
ADD COLUMN     "audienceAgeGroup" TEXT NOT NULL,
ADD COLUMN     "audienceGenderSplit" TEXT NOT NULL,
ADD COLUMN     "audienceInterests" TEXT[],
ADD COLUMN     "audienceInterestsOther" TEXT,
ADD COLUMN     "audienceTopCities" TEXT,
ADD COLUMN     "audienceTopCountries" TEXT NOT NULL,
ADD COLUMN     "availability" TEXT[],
ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "brandExclusivity" TEXT,
ADD COLUMN     "brandsExcluded" TEXT,
ADD COLUMN     "campaignTypes" TEXT[],
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "contentFormats" TEXT[],
ADD COLUMN     "contentFormatsOther" TEXT,
ADD COLUMN     "contentLinks" TEXT[],
ADD COLUMN     "contentStyles" TEXT[],
ADD COLUMN     "contentStylesOther" TEXT,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "genderIdentity" TEXT,
ADD COLUMN     "hasAgent" BOOLEAN,
ADD COLUMN     "invoicingAs" TEXT NOT NULL,
ADD COLUMN     "languages" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "lifestylePath" TEXT NOT NULL,
ADD COLUMN     "portfolioLink" TEXT,
ADD COLUMN     "previousBrands" TEXT[],
ADD COLUMN     "primaryNiche" TEXT NOT NULL,
ADD COLUMN     "primaryNicheOther" TEXT,
ADD COLUMN     "secondaryNiches" TEXT[],
ADD COLUMN     "socialPlatforms" JSONB NOT NULL,
ADD COLUMN     "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vatStatus" TEXT NOT NULL,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
