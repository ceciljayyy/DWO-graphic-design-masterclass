-- AlterTable
ALTER TABLE `Registration` ADD COLUMN `paymentAccessToken` VARCHAR(64) NULL;

-- AlterEnum: expand PaymentStatus (MySQL enum alter)
ALTER TABLE `Registration` MODIFY `paymentStatus` ENUM('PENDING', 'PAYMENT_SUBMITTED', 'PAID', 'FAILED', 'PAYMENT_REJECTED') NOT NULL DEFAULT 'PENDING';

-- Backfill unique access tokens for existing rows
UPDATE `Registration`
SET `paymentAccessToken` = CONCAT('tok_', REPLACE(UUID(), '-', ''))
WHERE `paymentAccessToken` IS NULL;

-- Enforce uniqueness
ALTER TABLE `Registration` MODIFY `paymentAccessToken` VARCHAR(64) NOT NULL;
CREATE UNIQUE INDEX `Registration_paymentAccessToken_key` ON `Registration`(`paymentAccessToken`);

-- CreateTable
CREATE TABLE `ManualPaymentSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `registrationId` VARCHAR(191) NOT NULL,
    `method` ENUM('MTN_MOBILE_MONEY') NOT NULL DEFAULT 'MTN_MOBILE_MONEY',
    `amount` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(8) NOT NULL DEFAULT 'GHS',
    `senderName` VARCHAR(191) NOT NULL,
    `senderPhone` VARCHAR(30) NOT NULL,
    `transactionReference` VARCHAR(120) NULL,
    `paymentDateTime` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reviewedAt` DATETIME(3) NULL,
    `reviewedByAdminId` VARCHAR(191) NULL,
    `adminNote` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ManualPaymentSubmission_registrationId_idx`(`registrationId`),
    INDEX `ManualPaymentSubmission_registrationId_isActive_idx`(`registrationId`, `isActive`),
    INDEX `ManualPaymentSubmission_submittedAt_idx`(`submittedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ManualPaymentSubmission` ADD CONSTRAINT `ManualPaymentSubmission_registrationId_fkey` FOREIGN KEY (`registrationId`) REFERENCES `Registration`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
