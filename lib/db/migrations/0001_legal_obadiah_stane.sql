ALTER TABLE "User" RENAME COLUMN "email" TO "address";--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "address" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "User" DROP COLUMN IF EXISTS "password";