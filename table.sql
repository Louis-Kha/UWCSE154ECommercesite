CREATE TABLE "reviews" (
	"item"	TEXT,
	"username"	TEXT,
	"score"	INTEGER,
	"review"	TEXT,
	"date"	NUMERIC
)

CREATE TABLE "store" (
	"id"	INTEGER,
	"name"	TEXT,
	"price"	TEXT,
	"category"	TEXT,
	"description"	TEXT,
	"stock"	INTEGER NOT NULL DEFAULT 0,
	"src"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
)

CREATE TABLE sqlite_sequence(name,seq)