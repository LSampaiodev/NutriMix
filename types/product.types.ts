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
  idEtiqueta: React.ReactNode;
  id: number; // Corresponde ao tipo Int do Prisma
  codigo: string; // Corresponde ao campo 'codigo' do Prisma
  versao: string; // Corresponde ao campo 'versao' do Prisma
  nome: string; // Corresponde ao campo 'nome' do Prisma
  createdAt: string; // Corresponde ao tipo DateTime do Prisma (pode ser Date em JS)
  // Campos que estavam na interface Product mas não no modelo Prisma foram removidos:
  // idEtiqueta, bloqueada, assinatura, data (se não for persistido)

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
  codigoProduto: string; // Mapeia para 'codigo' no backend
  nomeProduto: string; // Mapeia para 'nome' no backend
  nrRevisao?: string; // Mapeia para 'versao' no backend, input é string
  vFormula?: string; // Mapeia para 'versao' no backend, input é string
  data?: string; // Mantido para o formulário, mas não salvo no backend atualmente
  descricao?: string; // Não mapeado no backend
  categoria?: string; // Não mapeado no backend
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
