CREATE TABLE IF NOT EXISTS `price_alert` (
  `id` TEXT PRIMARY KEY,
  `userId` TEXT NOT NULL REFERENCES `user`(`id`),
  `commoditySlug` TEXT NOT NULL,
  `province` TEXT NOT NULL,
  `threshold` REAL NOT NULL,
  `active` INTEGER NOT NULL DEFAULT 1,
  `createdAt` INTEGER NOT NULL,
  `updatedAt` INTEGER NOT NULL,
  UNIQUE(`userId`, `commoditySlug`, `province`)
);

CREATE INDEX IF NOT EXISTS `price_alert_user_active` ON `price_alert` (`userId`, `active`);
