-- CreateTable
CREATE TABLE `Certificado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idEtiqueta` VARCHAR(191) NOT NULL,
    `lote` VARCHAR(191) NOT NULL,
    `codigoProduto` VARCHAR(191) NOT NULL,
    `nomeProduto` VARCHAR(191) NOT NULL,
    `dataFabricacao` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
