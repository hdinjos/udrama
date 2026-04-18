-- series table changes
ALTER TABLE "series" RENAME COLUMN "title" TO "primary_title";
ALTER TABLE "series" RENAME COLUMN "description" TO "plot";
ALTER TABLE "series" RENAME COLUMN "year" TO "start_year";
ALTER TABLE "series" ALTER COLUMN "start_year" DROP NOT NULL;
ALTER TABLE "series" DROP COLUMN "release_date";
ALTER TABLE "series" ADD COLUMN "imdb_id" varchar(20);
ALTER TABLE "series" ADD COLUMN "type" varchar(20);
ALTER TABLE "series" ADD COLUMN "original_title" varchar(255);
ALTER TABLE "series" ADD COLUMN "end_year" integer;
ALTER TABLE "series" ADD COLUMN "rating" numeric(2,1);
ALTER TABLE "series" ADD COLUMN "vote_count" integer;
ALTER TABLE "series" ADD CONSTRAINT "series_imdb_id_unique" UNIQUE("imdb_id");

-- episodes table changes
ALTER TABLE "episodes" RENAME COLUMN "durations" TO "runtime_seconds";
ALTER TABLE "episodes" ADD COLUMN "imdb_id" varchar(20);
ALTER TABLE "episodes" ADD COLUMN "title" varchar(255);
ALTER TABLE "episodes" ADD COLUMN "plot" text;
ALTER TABLE "episodes" ADD COLUMN "season" varchar(20);
ALTER TABLE "episodes" ADD COLUMN "release_date" date;
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_imdb_id_unique" UNIQUE("imdb_id");
