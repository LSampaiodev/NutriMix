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
    
    // Use the Labelary required header format (CI28 + print width & length + PON)
    // NOTE: PW812 and LL600 follow the sample; callers can still rely on config when necessary.
    let zpl = "^XA\n"
    zpl += "^CI28\n"
    zpl += "^PW812\n"
    zpl += "^LL600\n"
    zpl += "^PON\n\n"

    // Title (rotated, large)
    zpl += `^CF0,25\n`
    zpl += `^FO750,350^A0R,25,25^FD ${this.escapeZPL(product.nome)} ^FS\n\n`

    // Subtitle (rotated)
    zpl += `^CF0,20\n`
    const classificacaoText = product.classificacao || "Premix para Suínos"
    zpl += `^FO700,500^A0R,20,20^FD${this.escapeZPL(classificacaoText)}^FS\n\n`

    // Smaller text block default size
    zpl += `^CF0,16\n`

    // Indicação (single rotated line)
    const indicacao = product.indicacao || "Premix indicado para suínos em fase de terminação."
    zpl += `^FO650,50^A0R,16,16^FDIndicação: ${this.escapeZPL(indicacao)}^FS\n\n`

    // Composição - multi-line with wrapping using ^FB
    const composicao = this.truncateText(this.getComposition(product), 1000) // keep large to let ^FB wrap
    zpl += `^FO525,50\n`
    zpl += `^A0R,16,16\n`
    zpl += `^FB760,6,4,L,0\n`
    zpl += `^FDComposição: ${this.escapeZPL(composicao)}^FS\n\n`

    // Eventuais substitutivos - shorter block
    const substitutivos = this.getSubstitutivos(product)
    if (substitutivos) {
      const substitutivosText = this.truncateText(substitutivos, 1000)
      zpl += `^FO520,50\n`
      zpl += `^A0R,16,16\n`
      zpl += `^FB760,2,3,L,0\n`
      zpl += `^FDEventuais Substitutivos: ${this.escapeZPL(substitutivosText)}^FS\n\n`
    }

    // Garantias - multi-line with more allowed lines
    const garantias = this.truncateText(this.getNiveisGarantia(product), 1000)
    zpl += `^FO360,50\n`
    zpl += `^A0R,16,16\n`
    zpl += `^FB760,8,3,L,0\n`
    zpl += `^FDGarantias: ${this.escapeZPL(garantias)}^FS\n\n`

    // Modo de usar, Restrições, Conservação - simple rotated lines
    const modoUsar = product.modoUsar || "Adicionar 4 kg por tonelada de ração produzida."
    zpl += `^FO370,50^A0R,16,16^FDModo de usar: ${this.escapeZPL(modoUsar)}^FS\n`
    const restricoes = product.restricoes || "Não há restrições."
    zpl += `^FO350,50^A0R,16,16^FDRestrições: ${this.escapeZPL(restricoes)}^FS\n`
    const conservacao = product.modoConservacao || "Conservar sobre pallets, na embalagem original, em local seco, arejado e protegido da luz solar."
    zpl += `^FO325,50^A0R,16,16^FDConservação: ${this.escapeZPL(conservacao)}^FS\n\n`

    // Footer small font with manufactured/validity/lote/peso info
    zpl += `^CF0,14\n`
    const fabricado = new Date().toLocaleDateString("pt-BR")
    zpl += `^FO190,1030^A0R,14,14^FDFabricado: ${this.escapeZPL(fabricado)}^FS\n`
    const validade = product.prazoValidade || "270 dias"
    zpl += `^FO170,1030^A0R,14,14^FDValidade: ${this.escapeZPL(validade)}^FS\n`
    zpl += `^FO150,1030^A0R,14,14^FDLote: ${this.escapeZPL(product.lote || (`LOTE-${product.codigo || "000"}-${Date.now().toString().slice(-6)}`))}^FS\n`
    zpl += `^FO100,1030^A0R,18,18^FDPeso Liquido: ${this.escapeZPL(product.conteudoLiquido || "20 KG")}^FS\n\n`

    // Small notice block
    zpl += `^FO50,1030\n`
    zpl += `^A0R,10,10\n`
    zpl += `^FB190,2,3,L,0\n`
    zpl += `^FDPRODUTO ISENTO DE REGISTRO NO MINISTÉRIO DA AGRICULTURA E PECUARIA^FS\n\n`

    // Barcode (rotated) - fallback to code, prefixed if needed
    if (product.codigo) {
      zpl += `^FO50,850^BY1\n`
      zpl += `^BCR,80,Y,N,N\n`
      // The example uses 'SUP7504-T.BR' but we'll use product.codigo or prefixed if necessary
      zpl += `^FD${this.escapeZPL(product.codigo)}^FS\n\n`
    }

    zpl += "^XZ\n"

    return zpl
  }

  /**
   * Gera código ZPL para código de barras (BCR - rotated)
   */
  private static generateBarcodeZPL(code: string, x: number, y: number): string {
    // Keep compatibility for callers and sample: BY1 + BCR rotated
    return `^FO${x},${y}^BY1\n^BCR,80,Y,N,N\n^FD${this.escapeZPL(code)}^FS\n`
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
