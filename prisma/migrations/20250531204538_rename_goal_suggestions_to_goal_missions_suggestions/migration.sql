/*
  Warnings:

  - You are about to drop the `goal_suggestions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mission_suggestions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "goal_suggestions" DROP CONSTRAINT "goal_suggestion_fk_id_user_fkey";

-- DropForeignKey
ALTER TABLE "mission_suggestions" DROP CONSTRAINT "mission_suggestion_fk_id_goal_suggestion_fkey";

-- DropTable
DROP TABLE "goal_suggestions";

-- DropTable
DROP TABLE "mission_suggestions";

-- CreateTable
CREATE TABLE "goal_missions_suggestions" (
    "id" SERIAL NOT NULL,
    "suggestions" JSON,
    "fk_id_user" INTEGER,

    CONSTRAINT "goal_missions_suggestions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "goal_missions_suggestions" ADD CONSTRAINT "goal_missions_suggestions_fk_id_user_fkey" FOREIGN KEY ("fk_id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
