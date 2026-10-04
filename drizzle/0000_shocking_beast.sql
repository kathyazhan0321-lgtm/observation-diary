CREATE TABLE `entries` (
	`user_id` text NOT NULL,
	`date` text NOT NULL,
	`content` text NOT NULL,
	`metrics` text DEFAULT '{}' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`user_id`, `date`)
);
