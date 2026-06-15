-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "support";

-- CreateEnum
CREATE TYPE "support"."SupportTicketPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "support"."SupportTicketStatus" AS ENUM ('OPEN', 'WAITING_ON_SUPPORT', 'WAITING_ON_USER', 'RESOLVED', 'CLOSED');

-- CreateTable
CREATE TABLE "identity"."user_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "preferred_language" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Dar_es_Salaam',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support"."support_tickets" (
    "id" UUID NOT NULL,
    "owner_user_id" UUID NOT NULL,
    "owner_org_id" UUID,
    "subject" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',
    "priority" "support"."SupportTicketPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "support"."SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
    "description" TEXT NOT NULL,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support"."support_ticket_comments" (
    "id" UUID NOT NULL,
    "ticket_id" UUID NOT NULL,
    "actor_user_id" UUID,
    "body" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'PUBLIC',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_ticket_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "identity"."user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "support_tickets_owner_user_id_status_idx" ON "support"."support_tickets"("owner_user_id", "status");

-- CreateIndex
CREATE INDEX "support_tickets_owner_org_id_status_idx" ON "support"."support_tickets"("owner_org_id", "status");

-- CreateIndex
CREATE INDEX "support_tickets_status_priority_idx" ON "support"."support_tickets"("status", "priority");

-- CreateIndex
CREATE INDEX "support_ticket_comments_ticket_id_created_at_idx" ON "support"."support_ticket_comments"("ticket_id", "created_at");

-- CreateIndex
CREATE INDEX "support_ticket_comments_actor_user_id_idx" ON "support"."support_ticket_comments"("actor_user_id");

-- AddForeignKey
ALTER TABLE "identity"."user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "identity"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support"."support_tickets" ADD CONSTRAINT "support_tickets_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "identity"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support"."support_tickets" ADD CONSTRAINT "support_tickets_owner_org_id_fkey" FOREIGN KEY ("owner_org_id") REFERENCES "organization"."organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support"."support_ticket_comments" ADD CONSTRAINT "support_ticket_comments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "support"."support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support"."support_ticket_comments" ADD CONSTRAINT "support_ticket_comments_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "identity"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
