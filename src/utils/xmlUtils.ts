
// XML Processing Utilities

// Function to parse XML string to JavaScript object
export const parseXML = (xmlString: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      // Using DOMParser for client-side XML parsing
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      
      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        throw new Error("XML Parsing Error: " + parseError[0].textContent);
      }
      
      // Convert XML to JavaScript object
      const result = xmlToObj(xmlDoc);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to convert XML document to JavaScript object
const xmlToObj = (xml: Document): any => {
  // Start with the document element
  return elementToObj(xml.documentElement);
};

// Convert an XML element to a JavaScript object
const elementToObj = (element: Element): any => {
  let obj: any = {};
  
  // Add attributes if any
  if (element.attributes.length > 0) {
    obj["@attributes"] = {};
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      obj["@attributes"][attr.nodeName] = attr.nodeValue;
    }
  }
  
  // Process child nodes
  if (element.hasChildNodes()) {
    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];
      
      // Skip text nodes that are just whitespace
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.nodeValue?.trim();
        if (text && text.length > 0) {
          // If it's just a text node with no siblings, set the value directly
          if (element.childNodes.length === 1) {
            return text;
          }
          obj["#text"] = text;
        }
        continue;
      }
      
      // Process element nodes
      if (child.nodeType === Node.ELEMENT_NODE) {
        const childObj = elementToObj(child as Element);
        
        // Handle cases where there are multiple elements with the same name
        if (obj[child.nodeName]) {
          if (!Array.isArray(obj[child.nodeName])) {
            obj[child.nodeName] = [obj[child.nodeName]];
          }
          obj[child.nodeName].push(childObj);
        } else {
          obj[child.nodeName] = childObj;
        }
      }
    }
  }
  
  return obj;
};

// Function to validate XML against security concerns (XXE protection)
export const validateXmlSecurity = (xmlString: string): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Check for DOCTYPE declarations (potential XXE attacks)
  if (xmlString.includes("<!DOCTYPE")) {
    issues.push("XML contains DOCTYPE declaration, which could lead to XXE attacks");
  }
  
  // Check for external entity declarations
  if (xmlString.includes("<!ENTITY") && (xmlString.includes("SYSTEM") || xmlString.includes("PUBLIC"))) {
    issues.push("XML contains external entity declarations, which could lead to XXE attacks");
  }
  
  // Check for potentially malicious processing instructions
  if (xmlString.includes("<?xml-stylesheet")) {
    issues.push("XML contains xml-stylesheet processing instruction, which could be a security risk");
  }
  
  // Simple size validation
  if (xmlString.length > 10 * 1024 * 1024) { // 10 MB
    issues.push("XML file is too large (max 10MB)");
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
};

// Mock function to get sample XML data (for demo purposes)
export const getSampleXmlData = (): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<RationFormula id="RF-2023-001" version="1.0">
  <Metadata>
    <Name>Balanced Poultry Growth Formula</Name>
    <CreatedBy>John Doe</CreatedBy>
    <CreationDate>2023-04-15</CreationDate>
    <LastModified>2023-05-20</LastModified>
    <Status>Active</Status>
    <Category>Poultry</Category>
    <SubCategory>Growth</SubCategory>
    <BatchSize unit="kg">1000</BatchSize>
  </Metadata>
  <Ingredients>
    <Ingredient id="I-001">
      <Name>Corn</Name>
      <Percentage>45.5</Percentage>
      <Quantity unit="kg">455</Quantity>
      <Cost currency="BRL">0.80</Cost>
      <NutritionalValues>
        <Protein>8.5</Protein>
        <Fat>3.8</Fat>
        <Fiber>2.2</Fiber>
        <Moisture>12.0</Moisture>
        <Calcium>0.02</Calcium>
        <Phosphorus>0.25</Phosphorus>
      </NutritionalValues>
    </Ingredient>
    <Ingredient id="I-002">
      <Name>Soybean Meal</Name>
      <Percentage>30.0</Percentage>
      <Quantity unit="kg">300</Quantity>
      <Cost currency="BRL">1.45</Cost>
      <NutritionalValues>
        <Protein>46.5</Protein>
        <Fat>1.5</Fat>
        <Fiber>3.5</Fiber>
        <Moisture>12.0</Moisture>
        <Calcium>0.25</Calcium>
        <Phosphorus>0.60</Phosphorus>
      </NutritionalValues>
    </Ingredient>
    <Ingredient id="I-003">
      <Name>Wheat Bran</Name>
      <Percentage>10.0</Percentage>
      <Quantity unit="kg">100</Quantity>
      <Cost currency="BRL">0.65</Cost>
      <NutritionalValues>
        <Protein>15.0</Protein>
        <Fat>4.0</Fat>
        <Fiber>10.0</Fiber>
        <Moisture>12.0</Moisture>
        <Calcium>0.12</Calcium>
        <Phosphorus>1.20</Phosphorus>
      </NutritionalValues>
    </Ingredient>
    <Ingredient id="I-004">
      <Name>Limestone</Name>
      <Percentage>1.5</Percentage>
      <Quantity unit="kg">15</Quantity>
      <Cost currency="BRL">0.20</Cost>
      <NutritionalValues>
        <Calcium>38.0</Calcium>
      </NutritionalValues>
    </Ingredient>
    <Ingredient id="I-005">
      <Name>Vitamin Premix</Name>
      <Percentage>0.5</Percentage>
      <Quantity unit="kg">5</Quantity>
      <Cost currency="BRL">5.20</Cost>
    </Ingredient>
    <Ingredient id="I-006">
      <Name>Mineral Premix</Name>
      <Percentage>0.5</Percentage>
      <Quantity unit="kg">5</Quantity>
      <Cost currency="BRL">4.80</Cost>
    </Ingredient>
    <Ingredient id="I-007">
      <Name>Salt</Name>
      <Percentage>0.3</Percentage>
      <Quantity unit="kg">3</Quantity>
      <Cost currency="BRL">0.30</Cost>
    </Ingredient>
    <Ingredient id="I-008">
      <Name>Methionine</Name>
      <Percentage>0.2</Percentage>
      <Quantity unit="kg">2</Quantity>
      <Cost currency="BRL">12.50</Cost>
    </Ingredient>
    <Ingredient id="I-009">
      <Name>Vegetable Oil</Name>
      <Percentage>1.5</Percentage>
      <Quantity unit="kg">15</Quantity>
      <Cost currency="BRL">4.20</Cost>
      <NutritionalValues>
        <Fat>99.0</Fat>
      </NutritionalValues>
    </Ingredient>
  </Ingredients>
  <NutritionalProfile>
    <TotalProtein>21.25</TotalProtein>
    <TotalFat>3.62</TotalFat>
    <TotalFiber>3.18</TotalFiber>
    <TotalCalcium>0.92</TotalCalcium>
    <TotalPhosphorus>0.42</TotalPhosphorus>
    <MetabolizableEnergy unit="kcal/kg">2950</MetabolizableEnergy>
    <LysineTotal>1.15</LysineTotal>
    <MethionineTotal>0.52</MethionineTotal>
  </NutritionalProfile>
  <Instructions>
    <ProcessingStep number="1">
      <Description>Grind corn to medium consistency</Description>
      <Equipment>Hammer Mill - Model HM-500</Equipment>
      <Parameters>
        <Parameter name="GrindSize" value="2.5" unit="mm"/>
        <Parameter name="Temperature" value="Ambient" unit="C"/>
      </Parameters>
    </ProcessingStep>
    <ProcessingStep number="2">
      <Description>Mix all ingredients in the specified order</Description>
      <Equipment>Horizontal Mixer - Model MX-1000</Equipment>
      <Parameters>
        <Parameter name="MixingTime" value="15" unit="minutes"/>
        <Parameter name="MixerSpeed" value="25" unit="rpm"/>
      </Parameters>
      <Order>
        <Item position="1">Corn</Item>
        <Item position="2">Soybean Meal</Item>
        <Item position="3">Wheat Bran</Item>
        <Item position="4">Mineral Components</Item>
        <Item position="5">Vitamin Components</Item>
        <Item position="6">Oil (slow addition)</Item>
      </Order>
    </ProcessingStep>
    <ProcessingStep number="3">
      <Description>Pelletize the mixture</Description>
      <Equipment>Pellet Mill - Model PM-750</Equipment>
      <Parameters>
        <Parameter name="DieSize" value="4" unit="mm"/>
        <Parameter name="Temperature" value="85" unit="C"/>
        <Parameter name="Pressure" value="2.5" unit="bar"/>
      </Parameters>
    </ProcessingStep>
    <ProcessingStep number="4">
      <Description>Cool pellets to ambient temperature</Description>
      <Equipment>Cooler - Model C-500</Equipment>
      <Parameters>
        <Parameter name="CoolingTime" value="20" unit="minutes"/>
        <Parameter name="FinalTemperature" value="Ambient+5" unit="C"/>
      </Parameters>
    </ProcessingStep>
    <ProcessingStep number="5">
      <Description>Package in 25kg bags</Description>
      <Equipment>Bagging Station - Model BS-200</Equipment>
      <Parameters>
        <Parameter name="BagWeight" value="25" unit="kg"/>
        <Parameter name="ToleranceRange" value="±0.2" unit="kg"/>
      </Parameters>
    </ProcessingStep>
  </Instructions>
  <LabelingInformation>
    <ProductName>Premium Poultry Growth Feed</ProductName>
    <Manufacturer>ABC Feed Company</Manufacturer>
    <ManufacturerAddress>123 Farm Road, Rural City, Country</ManufacturerAddress>
    <RegistrationNumber>REG-12345-A</RegistrationNumber>
    <BatchIdentifier>Prefix-YYMM-Sequential</BatchIdentifier>
    <StorageInstructions>Store in a cool, dry place. Keep away from direct sunlight.</StorageInstructions>
    <ShelfLife unit="months">6</ShelfLife>
    <FeedingDirections>
      <AnimalType>Broiler Chicken</AnimalType>
      <AnimalAge unit="weeks">3-6</AnimalAge>
      <DailyAmount>As needed, approximately 100-120g per bird per day</DailyAmount>
      <SpecialInstructions>Ensure clean, fresh water is available at all times</SpecialInstructions>
    </FeedingDirections>
    <GuaranteedAnalysis>
      <Component name="Crude Protein" minimum="21.0" unit="%"/>
      <Component name="Crude Fat" minimum="3.5" unit="%"/>
      <Component name="Crude Fiber" maximum="4.0" unit="%"/>
      <Component name="Moisture" maximum="12.0" unit="%"/>
      <Component name="Calcium" minimum="0.9" maximum="1.0" unit="%"/>
      <Component name="Phosphorus" minimum="0.4" unit="%"/>
      <Component name="Sodium" minimum="0.15" unit="%"/>
      <Component name="Lysine" minimum="1.1" unit="%"/>
      <Component name="Methionine" minimum="0.5" unit="%"/>
    </GuaranteedAnalysis>
  </LabelingInformation>
  <QualityControl>
    <CriticalPoints>
      <Point name="Moisture">
        <Min>10.0</Min>
        <Max>12.0</Max>
        <Unit>%</Unit>
      </Point>
      <Point name="Pellet Durability">
        <Min>90.0</Min>
        <Unit>PDI</Unit>
      </Point>
      <Point name="Microbial Contamination">
        <Max>100000</Max>
        <Unit>CFU/g</Unit>
      </Point>
      <Point name="Mycotoxins - Aflatoxin">
        <Max>20</Max>
        <Unit>ppb</Unit>
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
      <Name>ISO 22000</Name>
      <Number>ISO22-789456</Number>
      <ValidUntil>2025-12-31</ValidUntil>
    </Certification>
    <Certification>
      <Name>GMP+</Name>
      <Number>GMP-456123</Number>
      <ValidUntil>2024-06-30</ValidUntil>
    </Certification>
  </Certifications>
</RationFormula>`;
};

// Parse the XML string and return data needed for label generation
export const extractLabelData = (xmlObj: any): any => {
  try {
    const formula = xmlObj;
    
    // Extract basic information
    const metadata = formula.Metadata;
    const labelInfo = formula.LabelingInformation;
    const nutritionalProfile = formula.NutritionalProfile;
    const guaranteedAnalysis = labelInfo.GuaranteedAnalysis;
    
    // Extract ingredients list
    const ingredients = formula.Ingredients.Ingredient;
    const ingredientsList = Array.isArray(ingredients) 
      ? ingredients.map((ing: any) => ing.Name) 
      : [ingredients.Name];
    
    // Combine all data needed for the label
    return {
      productName: labelInfo.ProductName,
      manufacturer: labelInfo.Manufacturer,
      address: labelInfo.ManufacturerAddress,
      registrationNumber: labelInfo.RegistrationNumber,
      category: metadata.Category,
      subCategory: metadata.SubCategory,
      ingredients: ingredientsList,
      guaranteedAnalysis: Array.isArray(guaranteedAnalysis.Component) 
        ? guaranteedAnalysis.Component 
        : [guaranteedAnalysis.Component],
      storageInstructions: labelInfo.StorageInstructions,
      shelfLife: `${labelInfo.ShelfLife} ${labelInfo.ShelfLife["@attributes"]?.unit || "months"}`,
      feedingDirections: {
        animalType: labelInfo.FeedingDirections.AnimalType,
        animalAge: `${labelInfo.FeedingDirections.AnimalAge} ${labelInfo.FeedingDirections.AnimalAge["@attributes"]?.unit || ""}`,
        dailyAmount: labelInfo.FeedingDirections.DailyAmount,
        specialInstructions: labelInfo.FeedingDirections.SpecialInstructions
      }
    };
  } catch (error) {
    console.error("Error extracting label data:", error);
    throw new Error("Failed to extract label data from XML");
  }
};

// Hash the XML content for storage and tracking
export const hashXmlContent = async (content: string): Promise<string> => {
  // Using SubtleCrypto API for hashing (this requires HTTPS in production)
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert the hash to a hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Utility to store processed XML with metadata
export interface ProcessedXml {
  id: string;
  name: string;
  category: string;
  content: string;
  hash: string;
  processed: boolean;
  created: string;
  processorId?: string;
  processorName?: string;
}

// Function to save processed XML (in a real app, this would be an API call)
export const saveProcessedXml = async (
  content: string,
  parsedData: any
): Promise<ProcessedXml> => {
  // Generate hash for the content
  const hash = await hashXmlContent(content);
  
  // Get metadata from parsed XML
  const metadata = parsedData.Metadata;
  const labelInfo = parsedData.LabelingInformation;
  
  // Create a new processed XML record
  const newRecord: ProcessedXml = {
    id: crypto.randomUUID(),
    name: labelInfo.ProductName || metadata.Name || "Unnamed Formula",
    category: `${metadata.Category || "Uncategorized"} - ${metadata.SubCategory || ""}`,
    content,
    hash,
    processed: true,
    created: new Date().toISOString()
  };
  
  // In a real app, you would send this to an API endpoint
  // For demo purposes, we'll store it in localStorage
  const existingRecords = JSON.parse(localStorage.getItem("processed_xml") || "[]");
  existingRecords.push(newRecord);
  localStorage.setItem("processed_xml", JSON.stringify(existingRecords));
  
  return newRecord;
};

// Function to get all saved XML records
export const getProcessedXmls = (): ProcessedXml[] => {
  return JSON.parse(localStorage.getItem("processed_xml") || "[]");
};

// Function to get a specific XML record by ID
export const getProcessedXmlById = (id: string): ProcessedXml | null => {
  const records = getProcessedXmls();
  return records.find(r => r.id === id) || null;
};
