/*
  Warnings:

  - You are about to drop the column `timezone` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_special_missions" ADD COLUMN     "expired_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "timezone",
ADD COLUMN     "timezone_name" VARCHAR(50) DEFAULT 'UTC',
ADD COLUMN     "timezone_offset" INTEGER DEFAULT 0;
