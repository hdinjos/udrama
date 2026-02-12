CREATE TABLE "genres" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "genres_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" text,
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "genres_slug_unique" UNIQUE("slug")
);
