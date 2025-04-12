
/**
 * Adaptador para XMLs de prescrição de ração em formato brasileiro
 */

/**
 * Converte um XML de prescrição de ração brasileiro para o formato padrão do sistema
 * @param xmlString String contendo o XML brasileiro de prescrição de ração
 * @returns XML convertido para o formato padrão do sistema
 */
export const convertBrazilianRationXml = (xmlString: string): string => {
  // Vamos transformar o formato brasileiro para o formato padrão do sistema
  const parser = new DOMParser();
  const brXmlDoc = parser.parseFromString(xmlString, "text/xml");
  
  // Criar novo documento XML com o formato padrão do sistema
  const serializer = new XMLSerializer();
  const standardXml = `<?xml version="1.0" encoding="UTF-8"?>
<RationFormula id="BR-${Date.now()}" version="1.0">
  <Metadata>
    <Name>${getTextContent(brXmlDoc, "Nome", "Produto")}</Name>
    <CreatedBy>Sistema Brasileiro</CreatedBy>
    <CreationDate>${getTextContent(brXmlDoc, "DataFabricacao", "Produto")}</CreationDate>
    <LastModified>${new Date().toISOString().split('T')[0]}</LastModified>
    <Status>Active</Status>
    <Category>${getTextContent(brXmlDoc, "Tipo", "Produto")}</Category>
    <SubCategory>Nutrição Animal</SubCategory>
    <BatchSize unit="kg">${getTextContent(brXmlDoc, "Peso", "Produto").replace(/[^0-9.]/g, '')}</BatchSize>
  </Metadata>
  <Ingredients>
    ${convertBrazilianIngredients(brXmlDoc)}
  </Ingredients>
  <NutritionalProfile>
    ${convertBrazilianGuarantees(brXmlDoc)}
    <MetabolizableEnergy unit="kcal/kg">3000</MetabolizableEnergy>
  </NutritionalProfile>
  <Instructions>
    <ProcessingStep number="1">
      <Description>Processamento padrão para ração</Description>
      <Equipment>Equipamento de Mistura</Equipment>
      <Parameters>
        <Parameter name="MixingTime" value="15" unit="minutes"/>
      </Parameters>
    </ProcessingStep>
  </Instructions>
  <LabelingInformation>
    <ProductName>${getTextContent(brXmlDoc, "Nome", "Produto")}</ProductName>
    <Manufacturer>${getTextContent(brXmlDoc, "RazaoSocial", "Fabricante")}</Manufacturer>
    <ManufacturerAddress>${getTextContent(brXmlDoc, "Endereco", "Fabricante")}</ManufacturerAddress>
    <RegistrationNumber>${getTextContent(brXmlDoc, "CNPJ", "Fabricante")}</RegistrationNumber>
    <BatchIdentifier>${getTextContent(brXmlDoc, "CodigoLote", "Produto")}</BatchIdentifier>
    <StorageInstructions>Armazenar em local seco e fresco.</StorageInstructions>
    <ShelfLife unit="months">6</ShelfLife>
    <FeedingDirections>
      <AnimalType>Cães</AnimalType>
      <AnimalAge unit="years">Adulto</AnimalAge>
      <DailyAmount>${getTextContent(brXmlDoc, "ModoDeUso")}</DailyAmount>
      <SpecialInstructions>${getTextContent(brXmlDoc, "ModoDeUso")}</SpecialInstructions>
    </FeedingDirections>
    <GuaranteedAnalysis>
      ${convertBrazilianGuaranteesForLabel(brXmlDoc)}
    </GuaranteedAnalysis>
  </LabelingInformation>
  <QualityControl>
    <CriticalPoints>
      <Point name="Moisture">
        <Max>${getGuaranteeValue(brXmlDoc, "Umidade", "Maximo")}</Max>
        <Unit>%</Unit>
      </Point>
    </CriticalPoints>
    <SamplingProtocol>
      <Frequency>Every batch</Frequency>
      <Method>Random sampling from 5 different points</Method>
      <SampleSize>500g</SampleSize>
      <RetentionPeriod unit="months">3</RetentionPeriod>
    </SamplingProtocol>
  </QualityControl>
  <Certifications>
    <Certification>
      <Name>Ministério da Agricultura</Name>
      <Number>BR-${Math.floor(Math.random() * 1000000)}</Number>
      <ValidUntil>${getTextContent(brXmlDoc, "Validade", "Produto")}</ValidUntil>
    </Certification>
  </Certifications>
</RationFormula>`;

  return standardXml;
};

// Funções auxiliares para extrair conteúdo do XML brasileiro
function getTextContent(xmlDoc: Document, tagName: string, parentTag?: string): string {
  let elements;
  if (parentTag) {
    const parent = xmlDoc.getElementsByTagName(parentTag)[0];
    if (parent) {
      elements = parent.getElementsByTagName(tagName);
    } else {
      return "";
    }
  } else {
    elements = xmlDoc.getElementsByTagName(tagName);
  }
  
  if (elements && elements.length > 0) {
    return elements[0].textContent || "";
  }
  return "";
}

function convertBrazilianIngredients(xmlDoc: Document): string {
  const ingredients = xmlDoc.getElementsByTagName("Ingrediente");
  let result = "";
  
  for (let i = 0; i < ingredients.length; i++) {
    const ing = ingredients[i];
    const nome = ing.getElementsByTagName("Nome")[0]?.textContent || "";
    const quantidade = ing.getElementsByTagName("Quantidade")[0]?.textContent || "";
    const percentagem = quantidade.replace(/[^0-9.]/g, '');
    
    result += `
    <Ingredient id="I-${i + 1}">
      <Name>${nome}</Name>
      <Percentage>${percentagem}</Percentage>
      <Quantity unit="kg">${Number(percentagem) * 10}</Quantity>
      <Cost currency="BRL">1.0</Cost>
      <NutritionalValues>
        <Protein>10.0</Protein>
        <Fat>5.0</Fat>
      </NutritionalValues>
    </Ingredient>`;
  }
  
  return result;
}

function getGuaranteeValue(xmlDoc: Document, nomeTipo: string, tipo: "Minimo" | "Maximo"): string {
  const garantias = xmlDoc.getElementsByTagName("Garantia");
  
  for (let i = 0; i < garantias.length; i++) {
    const garantia = garantias[i];
    const nome = garantia.getElementsByTagName("Nome")[0]?.textContent || "";
    
    if (nome === nomeTipo) {
      const valor = garantia.getElementsByTagName(tipo)[0]?.textContent || "";
      return valor.replace(/[^0-9.]/g, '');
    }
  }
  
  return "0";
}

function convertBrazilianGuarantees(xmlDoc: Document): string {
  const garantias = xmlDoc.getElementsByTagName("Garantia");
  let result = "";
  
  // Mapeamento de nomes em português para inglês
  const nomesMapeados: Record<string, string> = {
    "Proteína Bruta": "TotalProtein",
    "Extrato Etéreo": "TotalFat",
    "Fibra Bruta": "TotalFiber",
    "Umidade": "Moisture",
    "Cálcio": "TotalCalcium",
    "Fósforo": "TotalPhosphorus"
  };
  
  for (let i = 0; i < garantias.length; i++) {
    const garantia = garantias[i];
    const nome = garantia.getElementsByTagName("Nome")[0]?.textContent || "";
    const minimo = garantia.getElementsByTagName("Minimo")[0]?.textContent || "";
    const maximo = garantia.getElementsByTagName("Maximo")[0]?.textContent || "";
    
    // Usar nome mapeado ou o nome original
    const nomeMapeado = nomesMapeados[nome] || nome;
    
    if (minimo) {
      result += `<${nomeMapeado}>${minimo.replace(/[^0-9.]/g, '')}</${nomeMapeado}>\n    `;
    } else if (maximo) {
      result += `<${nomeMapeado}>${maximo.replace(/[^0-9.]/g, '')}</${nomeMapeado}>\n    `;
    }
  }
  
  return result;
}

function convertBrazilianGuaranteesForLabel(xmlDoc: Document): string {
  const garantias = xmlDoc.getElementsByTagName("Garantia");
  let result = "";
  
  // Mapeamento de nomes em português para inglês
  const nomesMapeados: Record<string, string> = {
    "Proteína Bruta": "Crude Protein",
    "Extrato Etéreo": "Fat",
    "Fibra Bruta": "Crude Fiber",
    "Umidade": "Moisture",
    "Cálcio": "Calcium",
    "Fósforo": "Phosphorus"
  };
  
  for (let i = 0; i < garantias.length; i++) {
    const garantia = garantias[i];
    const nome = garantia.getElementsByTagName("Nome")[0]?.textContent || "";
    const minimo = garantia.getElementsByTagName("Minimo")[0]?.textContent || "";
    const maximo = garantia.getElementsByTagName("Maximo")[0]?.textContent || "";
    
    // Usar nome mapeado ou o nome original
    const nomeMapeado = nomesMapeados[nome] || nome;
    
    result += `<Component name="${nomeMapeado}" `;
    
    if (minimo) {
      result += `minimum="${minimo.replace(/[^0-9.]/g, '')}" `;
    }
    
    if (maximo) {
      result += `maximum="${maximo.replace(/[^0-9.]/g, '')}" `;
    }
    
    result += `unit="%"/>\n      `;
  }
  
  return result;
}

/**
 * Verifica se um XML está no formato brasileiro
 * @param xmlString String contendo o XML
 * @returns boolean indicando se o XML está no formato brasileiro
 */
export const isBrazilianRationXml = (xmlString: string): boolean => {
  return xmlString.includes("<PrescricaoRacao>") || 
         xmlString.includes("<Produto>") ||
         xmlString.includes("<Fabricante>");
};
