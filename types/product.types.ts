export interface Ingredient {
  order: string | number;
  code: string;
  nome: string;
  valor: string;
  unidade: string;
  enumber?: string;
}

export interface Garantia {
  order: string | number;
  code: string;
  nome: string;
  valor: string;
  unidade: string;
  minimo?: string;
  maximo?: string;
}

export interface Substitutivo {
  code: string;
  descricao: string;
  sequence: string | number;
}

export interface Product {
  id: string;
  idEtiqueta: string;
  codigoProduto: string;
  nomeProduto: string;
  nrRevisao: number;
  vFormula: number;
  data: string;
  bloqueada: boolean;
  assinatura: boolean;
  // Novos campos do XML
  classificacao?: string;
  formaFisica?: string;
  composicao?: Ingredient[];
  enriquecimento?: string;
  substitutivos?: Substitutivo[];
  niveisGarantia?: Garantia[];
  indicacao?: string;
  modoUsar?: string;
  conteudoLiquido?: string;
  prazoValidade?: string;
  modoConservacao?: string;
  restricoes?: string;
}

export interface ProductFilters {
  search: string;
  status: "all" | "active" | "blocked" | "signed";
}

export interface ProductFormData {
  codigoProduto: string;
  nomeProduto: string;
  nrRevisao?: string | number;
  vFormula?: string | number;
  data?: string;
  descricao?: string;
  categoria?: string;
  // Novos campos do XML
  classificacao?: string;
  formaFisica?: string;
  composicao?: Ingredient[];
  enriquecimento?: string;
  substitutivos?: Substitutivo[];
  niveisGarantia?: Garantia[];
  indicacao?: string;
  modoUsar?: string;
  conteudoLiquido?: string;
  prazoValidade?: string;
  modoConservacao?: string;
  restricoes?: string;
}
