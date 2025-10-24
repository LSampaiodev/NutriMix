import type { Product } from "@/types/product.types"

export interface ZPLConfig {
  labelWidth: number // mm
  labelHeight: number // mm
  dpi: number
  fontSizes: {
    title: number
    subtitle: number
    normal: number
    small: number
  }
}

export class ZPLGeneratorService {
  private static readonly DEFAULT_CONFIG: ZPLConfig = {
    labelWidth: 100, // 100mm
    labelHeight: 50, // 50mm
    dpi: 300,
    fontSizes: {
      title: 20,
      subtitle: 15,
      normal: 12,
      small: 8
    }
  }

  /**
   * Gera código ZPL para impressora Zebra baseado nos dados do produto
   */
  static generateZPL(product: Product, config: Partial<ZPLConfig> = {}): string {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config }
    
    let zpl = "^XA\n" // Início do comando ZPL
    
    // Configurações da etiqueta
    zpl += `^CF0,${finalConfig.fontSizes.title}\n` // Fonte padrão
    
    // Logo da empresa (se disponível)
    zpl += this.generateLogoZPL(20, 20)
    
    // Nome do produto (título principal)
    zpl += `^FO20,20^FD${this.escapeZPL(product.nome)}^FS\n`
    
    // Classificação do produto
    zpl += `^CF0,${finalConfig.fontSizes.subtitle}\n`
    zpl += `^FO20,45^FDClassificação: ${this.escapeZPL(product.classificacao || "Alimento")}^FS\n`
    
    // Composição qualitativa (truncada para caber no rótulo)
    const composicao = this.truncateText(this.getComposition(product), 60)
    zpl += `^CF0,${finalConfig.fontSizes.normal}\n`
    zpl += `^FO20,70^FDComposição: ${this.escapeZPL(composicao)}^FS\n`
    
    // Eventuais substitutivos (se disponível)
    const substitutivos = this.getSubstitutivos(product)
    if (substitutivos) {
      const substitutivosText = this.truncateText(substitutivos, 60)
      zpl += `^FO20,90^FDSubstitutivos: ${this.escapeZPL(substitutivosText)}^FS\n`
    }
    
    // Níveis de garantia (truncada)
    const garantias = this.truncateText(this.getNiveisGarantia(product), 60)
    zpl += `^FO20,110^FDGarantias: ${this.escapeZPL(garantias)}^FS\n`
    
    // Peso líquido
    zpl += `^FO20,130^FDPeso: ${this.escapeZPL(product.conteudoLiquido || "Não especificado")}^FS\n`
    
    // Indicação de uso (truncada)
    const indicacao = this.truncateText(product.indicacao || "Para alimentação animal", 60)
    zpl += `^FO20,150^FDIndicação: ${this.escapeZPL(indicacao)}^FS\n`
    
    // Modo de usar (truncada)
    const modoUsar = this.truncateText(product.modoUsar || "Conforme orientação técnica", 60)
    zpl += `^FO20,170^FDModo de usar: ${this.escapeZPL(modoUsar)}^FS\n`
    
    // Restrições (truncada)
    const restricoes = this.truncateText(product.restricoes || "Manter em local seco e arejado", 60)
    zpl += `^FO20,190^FDRestrições: ${this.escapeZPL(restricoes)}^FS\n`
    
    // Dados da empresa
    zpl += `^CF0,${finalConfig.fontSizes.small}\n`
    zpl += `^FO20,210^FDTagTwo Indústria e Comércio Ltda^FS\n`
    zpl += `^FO20,225^FDRua Exemplo, 123, Centro, Cidade - UF^FS\n`
    zpl += `^FO20,240^FDCNPJ: 12.345.678/0001-90^FS\n`
    zpl += `^FO20,255^FDTelefone: (11) 1234-5678^FS\n`
    
    // Origem
    zpl += `^FO20,270^FDIndústria Brasileira^FS\n`
    
    // Datas e lote
    zpl += `^FO20,285^FDFabricado: ${this.escapeZPL(new Date().toLocaleDateString("pt-BR"))}^FS\n`
    zpl += `^FO20,300^FDValidade: ${this.escapeZPL(product.prazoValidade || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"))}^FS\n`
    zpl += `^FO20,315^FDLote: ${this.escapeZPL(`LOTE-${product.codigo}-${Date.now().toString().slice(-6)}`)}^FS\n`
    
    // Condições de conservação (truncada)
    const conservacao = this.truncateText(product.modoConservacao || "Manter em local seco, arejado e protegido da luz solar", 60)
    zpl += `^FO20,330^FDConservação: ${this.escapeZPL(conservacao)}^FS\n`
    
    // Código de barras
    if (product.codigo) {
      zpl += this.generateBarcodeZPL(product.codigo, 400, 400)
    }
    
    zpl += "^XZ\n" // Fim do comando ZPL
    
    return zpl
  }

  /**
   * Gera código ZPL para logo da empresa
   */
  private static generateLogoZPL(x: number, y: number): string {
    // Placeholder para logo - em implementação real, seria necessário
    // converter a imagem para formato ZPL ou usar um logo pré-definido
    return `^FO${x},${y}^GFA,100,100,10,^FS\n`
  }

  /**
   * Gera código ZPL para código de barras
   */
  private static generateBarcodeZPL(code: string, x: number, y: number): string {
    return `^FO${x},${y}^BY3\n^BCN,50,Y,N,N\n^FD${this.escapeZPL(code)}^FS\n`
  }

  /**
   * Escapa caracteres especiais para ZPL
   */
  private static escapeZPL(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\^/g, '\\^')
      .replace(/~/g, '\\~')
      .replace(/\n/g, '\\&')
      .replace(/\r/g, '')
  }

  /**
   * Trunca texto para caber no rótulo
   */
  private static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text
    }
    return text.substring(0, maxLength - 3) + "..."
  }

  /**
   * Obtém composição do produto
   */
  private static getComposition(product: Product): string {
    if (product.composicao && product.composicao.length > 0) {
      return product.composicao.map(ing => `${ing.nome} ${ing.valor}${ing.unidade}`).join(", ")
    }
    return "Não especificada"
  }

  /**
   * Obtém substitutivos do produto
   */
  private static getSubstitutivos(product: Product): string | null {
    if (product.substitutivos && product.substitutivos.length > 0) {
      return product.substitutivos.map(sub => sub.descricao).join(", ")
    }
    return null
  }

  /**
   * Obtém níveis de garantia do produto
   */
  private static getNiveisGarantia(product: Product): string {
    if (product.niveisGarantia && product.niveisGarantia.length > 0) {
      return product.niveisGarantia.map(gar => `${gar.nome}: ${gar.valor}${gar.unidade}`).join(", ")
    }
    return "Não especificada"
  }

  /**
   * Gera preview do rótulo em formato texto
   */
  static generateTextPreview(product: Product): string {
    let preview = ""
    
    preview += `========================================\n`
    preview += `           ${product.nome}\n`
    preview += `========================================\n\n`
    
    preview += `Classificação: ${product.classificacao || "Alimento"}\n`
    preview += `Composição: ${this.getComposition(product)}\n`
    
    const substitutivos = this.getSubstitutivos(product)
    if (substitutivos) {
      preview += `Substitutivos: ${substitutivos}\n`
    }
    
    preview += `Garantias: ${this.getNiveisGarantia(product)}\n`
    preview += `Peso: ${product.conteudoLiquido || "Não especificado"}\n`
    preview += `Indicação: ${product.indicacao || "Para alimentação animal"}\n`
    preview += `Modo de usar: ${product.modoUsar || "Conforme orientação técnica"}\n`
    preview += `Restrições: ${product.restricoes || "Manter em local seco e arejado"}\n\n`
    
    preview += `Fabricante:\n`
    preview += `TagTwo Indústria e Comércio Ltda\n`
    preview += `Rua Exemplo, 123, Centro, Cidade - UF\n`
    preview += `CNPJ: 12.345.678/0001-90\n`
    preview += `Tel: (11) 1234-5678\n\n`
    
    preview += `Indústria Brasileira\n\n`
    
    preview += `Fabricado: ${new Date().toLocaleDateString("pt-BR")}\n`
    preview += `Validade: ${product.prazoValidade || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}\n`
    preview += `Lote: LOTE-${product.codigo}-${Date.now().toString().slice(-6)}\n\n`
    
    preview += `Conservação: ${product.modoConservacao || "Manter em local seco, arejado e protegido da luz solar"}\n`
    
    if (product.codigo) {
      preview += `\nCódigo: ${product.codigo}\n`
    }
    
    return preview
  }
}
