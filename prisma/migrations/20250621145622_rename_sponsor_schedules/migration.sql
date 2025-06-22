/*
  Warnings:

  - You are about to drop the `special_mission_schedules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "special_mission_schedules" DROP CONSTRAINT "special_mission_schedules_fk_id_special_mission_fkey";

-- DropTable
DROP TABLE "special_mission_schedules";

-- CreateTable
CREATE TABLE "sponsor_special_mission_schedules" (
    "id" SERIAL NOT NULL,
    "fk_id_special_mission" INTEGER NOT NULL,
    "scheduled_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsor_special_mission_schedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sponsor_special_mission_schedules" ADD CONSTRAINT "sponsor_special_mission_schedules_fk_id_special_mission_fkey" FOREIGN KEY ("fk_id_special_mission") REFERENCES "special_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
