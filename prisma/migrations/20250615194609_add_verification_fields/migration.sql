/*
  Warnings:

  - You are about to drop the column `emailVerificationToken` on the `users` table. All the data in the column will be lost.
  - Made the column `created_at` on table `verification_attempts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerificationToken",
ADD COLUMN     "codeExpiry" TIMESTAMP(6),
ADD COLUMN     "verificationCode" VARCHAR(4);

-- AlterTable
ALTER TABLE "verification_attempts" ALTER COLUMN "created_at" SET NOT NULL;
