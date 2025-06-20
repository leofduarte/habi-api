-- CreateTable
CREATE TABLE "special_mission_schedules" (
    "id" SERIAL NOT NULL,
    "fk_id_special_mission" INTEGER NOT NULL,
    "scheduled_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "special_mission_schedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "special_mission_schedules" ADD CONSTRAINT "special_mission_schedules_fk_id_special_mission_fkey" FOREIGN KEY ("fk_id_special_mission") REFERENCES "special_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
