/*
  Warnings:

  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "goals" ADD COLUMN     "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "missions" ADD COLUMN     "completed_count" INTEGER,
ADD COLUMN     "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN DEFAULT true,
ADD COLUMN     "is_admin" BOOLEAN DEFAULT false,
ADD COLUMN     "is_verified" BOOLEAN DEFAULT false,
ADD COLUMN     "last_login" TIMESTAMP(6),
ADD COLUMN     "notification_preferences" JSON,
ADD COLUMN     "sponsor_special_mission" BOOLEAN DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);
