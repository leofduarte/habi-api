-- CreateTable
CREATE TABLE "daily_quotes" (
    "id" SERIAL NOT NULL,
    "quote" TEXT,

    CONSTRAINT "daily_quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "days_week" (
    "id" SERIAL NOT NULL,
    "day_name" VARCHAR(20),

    CONSTRAINT "days_week_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_suggestions" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "source" VARCHAR(255),
    "fk_id_user" INTEGER,

    CONSTRAINT "goal_suggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goals" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "fk_id_user" INTEGER,
    "is_done" BOOLEAN,

    CONSTRAINT "goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_completions" (
    "id" SERIAL NOT NULL,
    "fk_id_mission" INTEGER,
    "completion_date" DATE NOT NULL,
    "fk_id_user" INTEGER,

    CONSTRAINT "mission_completion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_days" (
    "id" SERIAL NOT NULL,
    "fk_id_mission" INTEGER,
    "fk_days_week_id" INTEGER,

    CONSTRAINT "mission_day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_suggestions" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "fk_id_goal_suggestion" INTEGER,

    CONSTRAINT "mission_suggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "emoji" VARCHAR(10),
    "description" TEXT,
    "streaks" INTEGER,
    "status" VARCHAR(50),
    "fk_id_goal" INTEGER,

    CONSTRAINT "mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prizes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "description" TEXT,
    "partner_name" VARCHAR,

    CONSTRAINT "prizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "special_missions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "steps" JSON,
    "link" VARCHAR,
    "is_partnership" BOOLEAN,

    CONSTRAINT "specialmissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_answers" (
    "id" SERIAL NOT NULL,
    "answers" JSON,
    "fk_id_user" INTEGER,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_daily_quotes" (
    "id" SERIAL NOT NULL,
    "fk_id_user" INTEGER,
    "fk_id_daily_quote" INTEGER,
    "presented_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_daily_quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_prizes" (
    "id" SERIAL NOT NULL,
    "fk_id_user" INTEGER,
    "fk_id_prize" INTEGER,
    "received_at" TIMESTAMP(6),
    "expires_at" TIMESTAMP(6),
    "is_used" BOOLEAN,
    "coupon" VARCHAR,

    CONSTRAINT "user_prizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_special_missions" (
    "id" SERIAL NOT NULL,
    "fk_id_user" INTEGER,
    "fk_id_special_mission" INTEGER,
    "available_at" TIMESTAMP(6),
    "completed_at" TIMESTAMP(6),

    CONSTRAINT "user_specialmissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "days_week_day_name_key" ON "days_week"("day_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "goal_suggestions" ADD CONSTRAINT "goal_suggestion_fk_id_user_fkey" FOREIGN KEY ("fk_id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goal_fk_id_user_fkey" FOREIGN KEY ("fk_id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mission_completions" ADD CONSTRAINT "mission_completion_fk_id_mission_fkey" FOREIGN KEY ("fk_id_mission") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mission_completions" ADD CONSTRAINT "mission_completions_fk_id_user_fkey" FOREIGN KEY ("fk_id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mission_days" ADD CONSTRAINT "mission_day_fk_days_week_id_fkey" FOREIGN KEY ("fk_days_week_id") REFERENCES "days_week"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mission_days" ADD CONSTRAINT "mission_day_fk_id_mission_fkey" FOREIGN KEY ("fk_id_mission") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mission_suggestions" ADD CONSTRAINT "mission_suggestion_fk_id_goal_suggestion_fkey" FOREIGN KEY ("fk_id_goal_suggestion") REFERENCES "goal_suggestions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "mission_fk_id_goal_fkey" FOREIGN KEY ("fk_id_goal") REFERENCES "goals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_fk_id_user_fkey" FOREIGN KEY ("fk_id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_daily_quotes" ADD CONSTRAINT "user_daily_quote_fk_id_daily_quote_fkey" FOREIGN KEY ("fk_id_daily_quote") REFERENCES "daily_quotes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_daily_quotes" ADD CONSTRAINT "user_daily_quote_fk_id_user_fkey" FOREIGN KEY ("fk_id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_prizes" ADD CONSTRAINT "user_prizes_fk_id_prize_fkey" FOREIGN KEY ("fk_id_prize") REFERENCES "prizes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_prizes" ADD CONSTRAINT "user_prizes_fk_id_user_fkey" FOREIGN KEY ("fk_id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_special_missions" ADD CONSTRAINT "user_specialmissions_fk_id_specialmission_fkey" FOREIGN KEY ("fk_id_special_mission") REFERENCES "special_missions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_special_missions" ADD CONSTRAINT "user_specialmissions_fk_id_user_fkey" FOREIGN KEY ("fk_id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
