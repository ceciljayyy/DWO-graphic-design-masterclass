-- Make WhatsApp required and phone optional.
-- Backfill missing WhatsApp from phone so existing rows remain valid.

UPDATE `Registration`
SET `whatsapp` = `phone`
WHERE (`whatsapp` IS NULL OR `whatsapp` = '')
  AND `phone` IS NOT NULL
  AND `phone` <> '';

UPDATE `Registration`
SET `whatsapp` = 'UNKNOWN'
WHERE `whatsapp` IS NULL OR `whatsapp` = '';

ALTER TABLE `Registration` MODIFY `whatsapp` VARCHAR(30) NOT NULL;
ALTER TABLE `Registration` MODIFY `phone` VARCHAR(30) NULL;
