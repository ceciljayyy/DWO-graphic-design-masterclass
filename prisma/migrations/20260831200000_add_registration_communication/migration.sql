-- AlterTable
ALTER TABLE `Registration`
    ADD COLUMN `welcomeEmailSentAt` DATETIME(3) NULL,
    ADD COLUMN `paymentReminderEmailSentAt` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `Registration_payment_reminder_idx` ON `Registration`(`paymentStatus`, `paymentReminderEmailSentAt`, `createdAt`);
