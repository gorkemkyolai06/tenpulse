-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('owner', 'manager', 'front_desk');

-- CreateEnum
CREATE TYPE "CourtSurface" AS ENUM ('clay', 'hard', 'grass', 'indoor');

-- CreateEnum
CREATE TYPE "CourtStatus" AS ENUM ('available', 'in_use', 'maintenance', 'closed');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('recorded', 'verified', 'disputed');

-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('private', 'group', 'clinic', 'camp');

-- CreateEnum
CREATE TYPE "BallMachinePriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "BallMachineStatus" AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "CourtMaintenanceCategory" AS ENUM ('resurfacing', 'net_replacement', 'line_painting', 'lighting', 'drainage', 'other');

-- CreateEnum
CREATE TYPE "CourtMaintenanceStatus" AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');

-- CreateEnum
CREATE TYPE "RateCategory" AS ENUM ('court_rental', 'lesson_package', 'league_night', 'clinic', 'group_event', 'other');

-- CreateEnum
CREATE TYPE "RateStatus" AS ENUM ('active', 'upcoming', 'archived');

-- CreateEnum
CREATE TYPE "StringingStatus" AS ENUM ('pending', 'in_progress', 'completed', 'delivered');

-- CreateTable
CREATE TABLE "tennis_clubs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "total_courts" INTEGER NOT NULL DEFAULT 8,
    "timezone" TEXT NOT NULL DEFAULT 'America/Phoenix',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tennis_clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'owner',
    "tennis_club_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courts" (
    "id" TEXT NOT NULL,
    "tennis_club_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wing" TEXT NOT NULL,
    "surface" "CourtSurface" NOT NULL DEFAULT 'hard',
    "ball_machine_spec" TEXT,
    "status" "CourtStatus" NOT NULL DEFAULT 'available',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_sessions" (
    "id" TEXT NOT NULL,
    "tennis_club_id" TEXT NOT NULL,
    "court_id" TEXT NOT NULL,
    "session_at" TIMESTAMP(3) NOT NULL,
    "lesson_type" "LessonType" NOT NULL DEFAULT 'private',
    "cash_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "card_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "participants" INTEGER NOT NULL DEFAULT 0,
    "ball_machine_rental_revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "SessionStatus" NOT NULL DEFAULT 'recorded',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ball_machine_maintenance" (
    "id" TEXT NOT NULL,
    "tennis_club_id" TEXT NOT NULL,
    "court_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reported_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "priority" "BallMachinePriority" NOT NULL DEFAULT 'medium',
    "status" "BallMachineStatus" NOT NULL DEFAULT 'open',
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ball_machine_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "court_maintenance" (
    "id" TEXT NOT NULL,
    "tennis_club_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "CourtMaintenanceCategory" NOT NULL DEFAULT 'other',
    "wing" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "status" "CourtMaintenanceStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "court_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_tiers" (
    "id" TEXT NOT NULL,
    "tennis_club_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rate_category" "RateCategory" NOT NULL DEFAULT 'court_rental',
    "status" "RateStatus" NOT NULL DEFAULT 'active',
    "base_price" DOUBLE PRECISION NOT NULL,
    "price_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stringing_orders" (
    "id" TEXT NOT NULL,
    "tennis_club_id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "string_type" TEXT NOT NULL,
    "racket_model" TEXT,
    "status" "StringingStatus" NOT NULL DEFAULT 'pending',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stringing_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "courts_tennis_club_id_status_idx" ON "courts"("tennis_club_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "courts_tennis_club_id_name_key" ON "courts"("tennis_club_id", "name");

-- CreateIndex
CREATE INDEX "lesson_sessions_tennis_club_id_session_at_idx" ON "lesson_sessions"("tennis_club_id", "session_at");

-- CreateIndex
CREATE INDEX "lesson_sessions_tennis_club_id_status_idx" ON "lesson_sessions"("tennis_club_id", "status");

-- CreateIndex
CREATE INDEX "ball_machine_maintenance_tennis_club_id_status_idx" ON "ball_machine_maintenance"("tennis_club_id", "status");

-- CreateIndex
CREATE INDEX "ball_machine_maintenance_tennis_club_id_priority_idx" ON "ball_machine_maintenance"("tennis_club_id", "priority");

-- CreateIndex
CREATE INDEX "court_maintenance_tennis_club_id_scheduled_at_idx" ON "court_maintenance"("tennis_club_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "rate_tiers_tennis_club_id_rate_category_idx" ON "rate_tiers"("tennis_club_id", "rate_category");

-- CreateIndex
CREATE INDEX "stringing_orders_tennis_club_id_status_idx" ON "stringing_orders"("tennis_club_id", "status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tennis_club_id_fkey" FOREIGN KEY ("tennis_club_id") REFERENCES "tennis_clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courts" ADD CONSTRAINT "courts_tennis_club_id_fkey" FOREIGN KEY ("tennis_club_id") REFERENCES "tennis_clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_sessions" ADD CONSTRAINT "lesson_sessions_tennis_club_id_fkey" FOREIGN KEY ("tennis_club_id") REFERENCES "tennis_clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_sessions" ADD CONSTRAINT "lesson_sessions_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "courts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ball_machine_maintenance" ADD CONSTRAINT "ball_machine_maintenance_tennis_club_id_fkey" FOREIGN KEY ("tennis_club_id") REFERENCES "tennis_clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ball_machine_maintenance" ADD CONSTRAINT "ball_machine_maintenance_court_id_fkey" FOREIGN KEY ("court_id") REFERENCES "courts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "court_maintenance" ADD CONSTRAINT "court_maintenance_tennis_club_id_fkey" FOREIGN KEY ("tennis_club_id") REFERENCES "tennis_clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_tiers" ADD CONSTRAINT "rate_tiers_tennis_club_id_fkey" FOREIGN KEY ("tennis_club_id") REFERENCES "tennis_clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stringing_orders" ADD CONSTRAINT "stringing_orders_tennis_club_id_fkey" FOREIGN KEY ("tennis_club_id") REFERENCES "tennis_clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

