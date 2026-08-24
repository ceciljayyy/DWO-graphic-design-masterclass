-- Align location column with required course registration field.
ALTER TABLE `Registration` MODIFY `location` VARCHAR(191) NOT NULL;
