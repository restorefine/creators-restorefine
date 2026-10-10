-- Lifestyle photo is optional; front and side photos stay required.
ALTER TABLE "creators" ALTER COLUMN "lifestylePath" DROP NOT NULL;
