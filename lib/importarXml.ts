import { XMLParser } from "fast-xml-parser";

export interface ProdutoImportado {
  codigo: string;
  versao: string;
  nome: string;
  classificacao?: string;
  formaFisica?: string;
  composicao?: Array<{ ordem: string; descricao: string; valor: string }>;
  enriquecimento?: string;
  substitutivos?: string[];
  niveisGarantia: Array<{ nome: string; valor: string; unidade: string; min?: string; max?: string }>;
  indicacao: string;
  modoUsar: string;
  conteudoLiquido: string;
  prazoValidade: string;
  modoConservacao: string;
  restricoes: string;
}

export function importarXml(xml: string): ProdutoImportado | null {
  const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: true });
  const obj = parser.parse(xml);
  const label = Array.isArray(obj.Labels?.Label) ? obj.Labels.Label[0] : obj.Labels?.Label;
  if (!label) return null;

  const getDescPT = (obj: any) =>
    obj?.Translation?.Description || obj?.Description || '';

  const general = label.General || {};
  const nome = getDescPT(label.Section2?.Description);
  const classificacao = getDescPT(label.Section3?.Parameter?.Value);
  const formaFisica = getDescPT(label.Section4?.Parameter?.Value);
  let composicao: any[] = [];
  if (label.Section6?.Composition?.Ingredient) {
    const ingrArr = Array.isArray(label.Section6.Composition.Ingredient)
      ? label.Section6.Composition.Ingredient
      : [label.Section6.Composition.Ingredient];
    composicao = ingrArr.map((ing: any) => ({
      ordem: ing.Order || '',
      descricao: getDescPT(ing.Description),
      valor: ing.Value || '',
    }));
  }
  const enriquecimento = getDescPT(label.Section7?.Text?.Value);
  let substitutivos: string[] = [];
  if (label.Section8?.Combination?.Content?.Text) {
    const texts = Array.isArray(label.Section8.Combination.Content.Text)
      ? label.Section8.Combination.Content.Text
      : [label.Section8.Combination.Content.Text];
    substitutivos = texts.map((txt: any) => getDescPT(txt.Value));
  }
  let niveisGarantia: any[] = [];
  if (label.Section9?.Analysis?.Nutrients?.Nutrient) {
    const nutArr = Array.isArray(label.Section9.Analysis.Nutrients.Nutrient)
      ? label.Section9.Analysis.Nutrients.Nutrient
      : [label.Section9.Analysis.Nutrients.Nutrient];
    niveisGarantia = nutArr.map((nut: any) => ({
      nome: getDescPT(nut.Description),
      valor: nut.MinimumGuaranteed || nut.Value || '',
      unidade: getDescPT(nut.Unit),
      min: nut.Minimum,
      max: nut.Maximum,
    }));
  }
  const indicacao = getDescPT(label.Section11?.Parameter?.Value);
  const modoUsar = getDescPT(label.Section12?.Parameter?.Value);
  const conteudoLiquido = getDescPT(label.Section13?.Text?.Value);
  const prazoValidade = label.Section14?.Parameter?.Value || '';
  const modoConservacao = getDescPT(label.Section15?.Text?.Value);
  const restricoes = getDescPT(label.Section16?.Parameter?.Value);

  return {
    codigo: general.Code || '',
    versao: general.Version || '',
    nome,
    classificacao,
    formaFisica,
    composicao,
    enriquecimento,
    substitutivos,
    niveisGarantia,
    indicacao,
    modoUsar,
    conteudoLiquido,
    prazoValidade,
    modoConservacao,
    restricoes,
  };
}
