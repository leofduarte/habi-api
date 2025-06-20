-- DropForeignKey
ALTER TABLE "missions" DROP CONSTRAINT "mission_fk_id_goal_fkey";

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "mission_fk_id_goal_fkey" FOREIGN KEY ("fk_id_goal") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
