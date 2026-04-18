-- Alter series table country_id from integer to varchar(3)
ALTER TABLE "series" ALTER COLUMN "country_id" TYPE varchar(3);

-- Alter countries table code from varchar(255) to varchar(3)
ALTER TABLE "countries" ALTER COLUMN "code" TYPE varchar(3);

-- Alter countries table name from varchar(255) to varchar(100)
ALTER TABLE "countries" ALTER COLUMN "name" TYPE varchar(100);
