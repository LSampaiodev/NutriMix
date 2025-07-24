export interface LabelData {
  codigo: string
  idRotulo: string
  descricao: string
  ultimaAtualizacao: string
  bobinaEtiqueta: string
  layout: string
  prazoValidade: string
  quantidade: number
  data: string
  lote: string
  peso: string
  idioma: "Português" | "Espanhol" | "Inglês"
}

export interface PrinterConfig {
  id: string
  name: string
  type: "USB" | "Network"
  status: "online" | "offline" | "standby"
  isSelected: boolean
}
