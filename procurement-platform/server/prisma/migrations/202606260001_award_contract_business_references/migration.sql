ALTER TABLE "evaluation"."award_recommendations"
  ADD COLUMN "reference" TEXT;

UPDATE "evaluation"."award_recommendations"
SET "reference" = 'PX-AWD-' || EXTRACT(YEAR FROM "created_at")::int || '-' || UPPER(SUBSTRING(REPLACE("id"::text, '-', ''), 1, 8))
WHERE "reference" IS NULL;

ALTER TABLE "evaluation"."award_recommendations"
  ALTER COLUMN "reference" SET NOT NULL;

CREATE UNIQUE INDEX "award_recommendations_reference_key"
  ON "evaluation"."award_recommendations"("reference");

ALTER TABLE "contract"."award_notices"
  ADD COLUMN "reference" TEXT;

UPDATE "contract"."award_notices"
SET "reference" = 'PX-NOT-' || EXTRACT(YEAR FROM "created_at")::int || '-' || UPPER(SUBSTRING(REPLACE("id"::text, '-', ''), 1, 8))
WHERE "reference" IS NULL;

ALTER TABLE "contract"."award_notices"
  ALTER COLUMN "reference" SET NOT NULL;

CREATE UNIQUE INDEX "award_notices_reference_key"
  ON "contract"."award_notices"("reference");

ALTER TABLE "contract"."goods_inspections"
  ADD CONSTRAINT "goods_inspections_contract_id_fkey"
  FOREIGN KEY ("contract_id") REFERENCES "contract"."contracts"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
