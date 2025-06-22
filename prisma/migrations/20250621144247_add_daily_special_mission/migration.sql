-- CreateTable
CREATE TABLE "daily_special_mission" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fk_id_special_mission" INTEGER NOT NULL,

    CONSTRAINT "daily_special_mission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_special_mission_date_key" ON "daily_special_mission"("date");

-- AddForeignKey
ALTER TABLE "daily_special_mission" ADD CONSTRAINT "daily_special_mission_fk_id_special_mission_fkey" FOREIGN KEY ("fk_id_special_mission") REFERENCES "special_missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
