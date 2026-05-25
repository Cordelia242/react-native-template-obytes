CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_category_id` text NOT NULL,
	`currency_id` text NOT NULL,
	`name` text NOT NULL,
	`initial_balance` real NOT NULL,
	`current_balance` real NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`account_category_id`) REFERENCES `account_category`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`currency_id`) REFERENCES `currency`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `account_category` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `currency` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`symbol` text NOT NULL,
	`exchange_rate` real DEFAULT 1 NOT NULL,
	`is_enabled` integer DEFAULT 0 NOT NULL,
	`is_default` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `currency_code_unique` ON `currency` (`code`);--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tag_name_unique` ON `tag` (`name`);--> statement-breakpoint
CREATE TABLE `transaction_tag` (
	`tag_id` text NOT NULL,
	`transaction_id` text NOT NULL,
	PRIMARY KEY(`tag_id`, `transaction_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`transaction_id`) REFERENCES `transaction`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `transaction` ADD `account_id` text NOT NULL REFERENCES account(id);