-- CreateTable
CREATE TABLE "rest_days" (
    "id" SERIAL NOT NULL,
    "fk_id_user" INTEGER NOT NULL,
    "fk_days_week" INTEGER NOT NULL,

    CONSTRAINT "rest_days_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rest_days" ADD CONSTRAINT "rest_days_fk_id_user_fkey" FOREIGN KEY ("fk_id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rest_days" ADD CONSTRAINT "rest_days_fk_days_week_fkey" FOREIGN KEY ("fk_days_week") REFERENCES "days_week"("id") ON DELETE CASCADE ON UPDATE CASCADE;
