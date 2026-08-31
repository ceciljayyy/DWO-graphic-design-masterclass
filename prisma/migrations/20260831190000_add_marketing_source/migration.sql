-- AlterTable
ALTER TABLE `Registration`
    ADD COLUMN `marketingSource` ENUM('INSTAGRAM', 'TIKTOK', 'WHATSAPP', 'FACEBOOK', 'GOOGLE', 'DIRECT', 'OTHER') NULL,
    ADD COLUMN `utmSource` VARCHAR(120) NULL,
    ADD COLUMN `utmMedium` VARCHAR(120) NULL,
    ADD COLUMN `utmCampaign` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Registration_marketingSource_idx` ON `Registration`(`marketingSource`);
