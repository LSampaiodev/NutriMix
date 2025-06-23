import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/components/ui/card";
import { Separator } from "@/presentation/components/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/components/ui/tabs";
import { ScrollArea } from "@/presentation/components/components/ui/scroll-area";
import { Tag } from "lucide-react";

interface XmlViewerProps {
  data: any;
  rawXml?: string;
}

const XmlViewer: React.FC<XmlViewerProps> = ({ data, rawXml }) => {
  // Formatted XML data for different sections
  const formulaMetadata = useMemo(() => {
    if (!data || !data.Metadata) return null;
    
    return {
      name: data.Metadata.Name,
      category: data.Metadata.Category,
      subCategory: data.Metadata.SubCategory,
      status: data.Metadata.Status,
      createdBy: data.Metadata.CreatedBy,
      creationDate: data.Metadata.CreationDate,
      lastModified: data.Metadata.LastModified,
      batchSize: `${data.Metadata.BatchSize} ${data.Metadata.BatchSize?.["@attributes"]?.unit || "kg"}`
    };
  }, [data]);
  
  const ingredients = useMemo(() => {
    if (!data || !data.Ingredients || !data.Ingredients.Ingredient) return [];
    
    const ingredientsList = Array.isArray(data.Ingredients.Ingredient) 
      ? data.Ingredients.Ingredient 
      : [data.Ingredients.Ingredient];
    
    return ingredientsList.map((ing: any) => ({
      id: ing["@attributes"]?.id || "Unknown",
      name: ing.Name,
      percentage: `${ing.Percentage}%`,
      quantity: `${ing.Quantity} ${ing.Quantity?.["@attributes"]?.unit || "kg"}`,
      cost: ing.Cost ? `${ing.Cost} ${ing.Cost?.["@attributes"]?.currency || ""}` : "N/A",
      nutritionalValues: ing.NutritionalValues || {}
    }));
  }, [data]);
  
  const nutritionalProfile = useMemo(() => {
    if (!data || !data.NutritionalProfile) return null;
    
    return {
      protein: data.NutritionalProfile.TotalProtein ? `${data.NutritionalProfile.TotalProtein}%` : "N/A",
      fat: data.NutritionalProfile.TotalFat ? `${data.NutritionalProfile.TotalFat}%` : "N/A",
      fiber: data.NutritionalProfile.TotalFiber ? `${data.NutritionalProfile.TotalFiber}%` : "N/A",
      calcium: data.NutritionalProfile.TotalCalcium ? `${data.NutritionalProfile.TotalCalcium}%` : "N/A",
      phosphorus: data.NutritionalProfile.TotalPhosphorus ? `${data.NutritionalProfile.TotalPhosphorus}%` : "N/A",
      energy: data.NutritionalProfile.MetabolizableEnergy ? 
        `${data.NutritionalProfile.MetabolizableEnergy} ${data.NutritionalProfile.MetabolizableEnergy?.["@attributes"]?.unit || "kcal/kg"}` : 
        "N/A",
      lysine: data.NutritionalProfile.LysineTotal ? `${data.NutritionalProfile.LysineTotal}%` : "N/A",
      methionine: data.NutritionalProfile.MethionineTotal ? `${data.NutritionalProfile.MethionineTotal}%` : "N/A"
    };
  }, [data]);
  
  const labelingInfo = useMemo(() => {
    if (!data || !data.LabelingInformation) return null;
    
    const labelInfo = data.LabelingInformation;
    
    return {
      productName: labelInfo.ProductName,
      manufacturer: labelInfo.Manufacturer,
      address: labelInfo.ManufacturerAddress,
      registrationNumber: labelInfo.RegistrationNumber,
      batchIdentifier: labelInfo.BatchIdentifier,
      storageInstructions: labelInfo.StorageInstructions,
      shelfLife: `${labelInfo.ShelfLife} ${labelInfo.ShelfLife?.["@attributes"]?.unit || "months"}`,
      feedingDirections: {
        animalType: labelInfo.FeedingDirections?.AnimalType,
        animalAge: `${labelInfo.FeedingDirections?.AnimalAge} ${labelInfo.FeedingDirections?.AnimalAge?.["@attributes"]?.unit || ""}`,
        dailyAmount: labelInfo.FeedingDirections?.DailyAmount,
        specialInstructions: labelInfo.FeedingDirections?.SpecialInstructions
      },
      guaranteedAnalysis: Array.isArray(labelInfo.GuaranteedAnalysis?.Component) 
        ? labelInfo.GuaranteedAnalysis?.Component 
        : labelInfo.GuaranteedAnalysis?.Component ? [labelInfo.GuaranteedAnalysis?.Component] : []
    };
  }, [data]);
  
  const processingSteps = useMemo(() => {
    if (!data || !data.Instructions || !data.Instructions.ProcessingStep) return [];
    
    const steps = Array.isArray(data.Instructions.ProcessingStep) 
      ? data.Instructions.ProcessingStep 
      : [data.Instructions.ProcessingStep];
    
    return steps.map((step: any) => ({
      number: step["@attributes"]?.number || "Unknown",
      description: step.Description,
      equipment: step.Equipment,
      parameters: step.Parameters?.Parameter ? (
        Array.isArray(step.Parameters.Parameter) 
          ? step.Parameters.Parameter 
          : [step.Parameters.Parameter]
      ) : [],
      order: step.Order?.Item ? (
        Array.isArray(step.Order.Item) 
          ? step.Order.Item 
          : [step.Order.Item]
      ) : []
    }));
  }, [data]);
  
  if (!data) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>XML Viewer</CardTitle>
          <CardDescription>
            No XML data available for viewing
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center">
          <Tag className="mr-2 h-5 w-5 text-primary" />
          <CardTitle>XML Viewer</CardTitle>
        </div>
        <CardDescription>
          Detailed view of the ration formula XML data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="w-full grid grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="nutritional">Nutritional</TabsTrigger>
            <TabsTrigger value="labeling">Labeling</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            {rawXml && <TabsTrigger value="raw">Raw XML</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview" className="p-4">
            {formulaMetadata ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{formulaMetadata.name}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                    <p>{formulaMetadata.category} - {formulaMetadata.subCategory}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <p>{formulaMetadata.status}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Created By</h4>
                    <p>{formulaMetadata.createdBy}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Batch Size</h4>
                    <p>{formulaMetadata.batchSize}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Creation Date</h4>
                    <p>{formulaMetadata.creationDate}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Last Modified</h4>
                    <p>{formulaMetadata.lastModified}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Ingredients Summary</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {ingredients.slice(0, 6).map((ing) => (
                      <div key={ing.id} className="border rounded p-2 text-sm">
                        <div className="font-medium">{ing.name}</div>
                        <div className="text-xs text-muted-foreground">{ing.percentage}</div>
                      </div>
                    ))}
                    {ingredients.length > 6 && (
                      <div className="border rounded p-2 text-sm bg-muted/50 flex items-center justify-center">
                        +{ingredients.length - 6} more
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-2">Processing Steps</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {processingSteps.slice(0, 4).map((step) => (
                      <div key={step.number} className="border rounded p-2 text-sm">
                        <div className="font-medium">Step {step.number}</div>
                        <div className="text-xs">{step.description}</div>
                      </div>
                    ))}
                    {processingSteps.length > 4 && (
                      <div className="border rounded p-2 text-sm bg-muted/50 flex items-center justify-center">
                        +{processingSteps.length - 4} more steps
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p>No metadata available</p>
            )}
          </TabsContent>
          
          {/* Fix for the TypeScript error - ensuring we're not rendering unknown types */}
          <TabsContent value="ingredients" className="p-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Formula Ingredients</h3>
                
                {ingredients.length > 0 ? (
                  ingredients.map((ing) => (
                    <div key={ing.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-medium">{ing.name}</h4>
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                          {ing.percentage}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <h5 className="text-sm font-medium text-muted-foreground">ID</h5>
                          <p>{ing.id}</p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-muted-foreground">Quantity</h5>
                          <p>{ing.quantity}</p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-muted-foreground">Cost</h5>
                          <p>{ing.cost}</p>
                        </div>
                      </div>
                      
                      {ing.nutritionalValues && Object.keys(ing.nutritionalValues).length > 0 && (
                        <>
                          <h5 className="text-sm font-medium mb-2">Nutritional Values</h5>
                          <div className="grid grid-cols-3 gap-2">
                            {Object.entries(ing.nutritionalValues).map(([key, value]) => (
                              <div key={key} className="text-sm border rounded p-2">
                                <span className="text-xs text-muted-foreground">{key}</span>
                                <div>{String(value)}</div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No ingredients data available</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="nutritional" className="p-4">
            {nutritionalProfile ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Nutritional Profile</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="text-lg font-medium mb-4">Macronutrients</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground">Total Protein</h5>
                        <p className="text-lg">{nutritionalProfile.protein}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground">Total Fat</h5>
                        <p className="text-lg">{nutritionalProfile.fat}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground">Total Fiber</h5>
                        <p className="text-lg">{nutritionalProfile.fiber}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground">Metabolizable Energy</h5>
                        <p className="text-lg">{nutritionalProfile.energy}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="text-lg font-medium mb-4">Minerals & Amino Acids</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground">Total Calcium</h5>
                        <p className="text-lg">{nutritionalProfile.calcium}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground">Total Phosphorus</h5>
                        <p className="text-lg">{nutritionalProfile.phosphorus}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground">Lysine Total</h5>
                        <p className="text-lg">{nutritionalProfile.lysine}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-muted-foreground">Methionine Total</h5>
                        <p className="text-lg">{nutritionalProfile.methionine}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {labelingInfo?.guaranteedAnalysis?.length > 0 && (
                  <div className="border rounded-lg p-4 mt-6">
                    <h4 className="text-lg font-medium mb-4">Guaranteed Analysis</h4>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {labelingInfo.guaranteedAnalysis.map((comp: any, idx: number) => (
                        <div key={idx} className="border rounded p-3">
                          <h5 className="font-medium">{comp["@attributes"]?.name}</h5>
                          
                          <div className="grid grid-cols-2 text-sm gap-2 mt-2">
                            {comp["@attributes"]?.minimum && (
                              <div>
                                <span className="text-xs text-muted-foreground">Min</span>
                                <p>{comp["@attributes"]?.minimum} {comp["@attributes"]?.unit}</p>
                              </div>
                            )}
                            
                            {comp["@attributes"]?.maximum && (
                              <div>
                                <span className="text-xs text-muted-foreground">Max</span>
                                <p>{comp["@attributes"]?.maximum} {comp["@attributes"]?.unit}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p>No nutritional profile data available</p>
            )}
          </TabsContent>
          
          <TabsContent value="labeling" className="p-4">
            {labelingInfo ? (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">{labelingInfo.productName}</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Manufacturer</h4>
                      <p>{labelingInfo.manufacturer}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                      <p>{labelingInfo.address}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Registration Number</h4>
                      <p>{labelingInfo.registrationNumber}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Batch Identifier Format</h4>
                      <p>{labelingInfo.batchIdentifier}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Storage Instructions</h4>
                      <p>{labelingInfo.storageInstructions}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Shelf Life</h4>
                      <p>{labelingInfo.shelfLife}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-medium mb-4">Feeding Directions</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-muted-foreground">Animal Type</h5>
                      <p>{labelingInfo.feedingDirections?.animalType}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-muted-foreground">Animal Age</h5>
                      <p>{labelingInfo.feedingDirections?.animalAge}</p>
                    </div>
                    
                    <div className="col-span-2">
                      <h5 className="text-sm font-medium text-muted-foreground">Daily Amount</h5>
                      <p>{labelingInfo.feedingDirections?.dailyAmount}</p>
                    </div>
                    
                    <div className="col-span-2">
                      <h5 className="text-sm font-medium text-muted-foreground">Special Instructions</h5>
                      <p>{labelingInfo.feedingDirections?.specialInstructions}</p>
                    </div>
                  </div>
                </div>
                
                {labelingInfo.guaranteedAnalysis?.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h4 className="text-lg font-medium mb-4">Guaranteed Analysis</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {labelingInfo.guaranteedAnalysis.map((comp: any, idx: number) => (
                        <div key={idx} className="border rounded p-3">
                          <h5 className="font-medium">{comp["@attributes"]?.name}</h5>
                          
                          <div className="grid grid-cols-2 text-sm gap-2 mt-2">
                            {comp["@attributes"]?.minimum && (
                              <div>
                                <span className="text-xs text-muted-foreground">Min</span>
                                <p>{comp["@attributes"]?.minimum} {comp["@attributes"]?.unit}</p>
                              </div>
                            )}
                            
                            {comp["@attributes"]?.maximum && (
                              <div>
                                <span className="text-xs text-muted-foreground">Max</span>
                                <p>{comp["@attributes"]?.maximum} {comp["@attributes"]?.unit}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p>No labeling information available</p>
            )}
          </TabsContent>
          
          <TabsContent value="processing" className="p-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Processing Instructions</h3>
                
                {processingSteps.length > 0 ? (
                  <div className="space-y-6">
                    {processingSteps.map((step) => (
                      <div key={step.number} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium">Step {step.number}</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="col-span-2">
                            <h5 className="text-sm font-medium text-muted-foreground">Description</h5>
                            <p>{step.description}</p>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground">Equipment</h5>
                            <p>{step.equipment}</p>
                          </div>
                        </div>
                        
                        {step.parameters.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-muted-foreground mb-2">Parameters</h5>
                            <div className="grid grid-cols-3 gap-2">
                              {step.parameters.map((param: any, idx: number) => (
                                <div key={idx} className="text-sm border rounded p-2">
                                  <span className="text-xs text-muted-foreground">{param["@attributes"]?.name}</span>
                                  <div>
                                    {param["@attributes"]?.value} {param["@attributes"]?.unit}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {step.order.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-muted-foreground mb-2">Order</h5>
                            <ol className="list-decimal pl-5 space-y-1">
                              {step.order.map((item: any, idx: number) => (
                                <li key={idx}>
                                  {typeof item === "string" ? item : item["#text"]}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No processing step data available</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {rawXml && (
            <TabsContent value="raw" className="p-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="font-mono text-xs whitespace-pre-wrap bg-muted p-4 rounded-md">
                  {rawXml}
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default XmlViewer;
