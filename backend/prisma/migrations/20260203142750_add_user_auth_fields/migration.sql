-- AlterTable
ALTER TABLE `user` DROP COLUMN `password`,
    ADD COLUMN `canAccessOtherUnits` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isResponsibleTechnician` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `login` VARCHAR(191) NOT NULL,
    ADD COLUMN `passwordHash` VARCHAR(191) NOT NULL,
    ADD COLUMN `permission` ENUM('CADASTRO', 'IMPRESSAO', 'AVANCADO', 'AMBOS') NOT NULL DEFAULT 'CADASTRO',
    ADD COLUMN `unitCode` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_login_key` ON `User`(`login`);
