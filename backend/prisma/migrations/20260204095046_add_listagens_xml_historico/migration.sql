-- AlterTable
ALTER TABLE `produto` ADD COLUMN `idEtiqueta` VARCHAR(191) NULL,
    ADD COLUMN `rotulo` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `XmlImportacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idEmpresa` VARCHAR(191) NOT NULL,
    `idRTPI` VARCHAR(191) NOT NULL,
    `revisao` VARCHAR(191) NOT NULL,
    `idEtiqueta` VARCHAR(191) NOT NULL,
    `codigoProduto` VARCHAR(191) NOT NULL,
    `nomeProduto` VARCHAR(191) NOT NULL,
    `lingua` VARCHAR(191) NOT NULL,
    `nomeArquivo` VARCHAR(191) NOT NULL,
    `dataInclusao` DATETIME(3) NOT NULL,
    `arquivo` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ImpressaoHistorico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idEtiqueta` VARCHAR(191) NOT NULL,
    `idUsuario` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `codigoUnidade` VARCHAR(191) NOT NULL,
    `unidade` VARCHAR(191) NOT NULL,
    `qtd` INTEGER NOT NULL,
    `dataHora` DATETIME(3) NOT NULL,
    `lote` VARCHAR(191) NOT NULL,
    `codigoProduto` VARCHAR(191) NOT NULL,
    `peso` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
