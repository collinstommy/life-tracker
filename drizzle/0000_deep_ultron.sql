DROP TABLE IF EXISTS activity;
DROP TABLE IF EXISTS score;
DROP TABLE IF EXISTS todo;

CREATE TABLE `activity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text,
	`userId` text,
	`date` text,
	`created_on` text
);
--> statement-breakpoint
CREATE TABLE `score` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quality` integer NOT NULL,
	`date` text,
	`userId` text,
	`type` text,
	`created_on` text
);
--> statement-breakpoint
CREATE TABLE `todo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`complete` integer,
	`text` text,
	`userId` text
);
--> statement-breakpoint
CREATE INDEX `userId_activity_idx` ON `activity` (`userId`);--> statement-breakpoint
CREATE INDEX `date_activity_idx` ON `activity` (`date`);--> statement-breakpoint
CREATE INDEX `userId_score_idx` ON `score` (`userId`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `score` (`type`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `score` (`date`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `todo` (`userId`);

INSERT INTO todo (complete, text, userId) VALUES (1, 'shopping', '1')

