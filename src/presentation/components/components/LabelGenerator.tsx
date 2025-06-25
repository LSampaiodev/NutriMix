import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/presentation/components/components/ui/card";
import { Button } from "@/presentation/components/components/ui/button";
import { Printer, Download, FileText, RefreshCw } from "lucide-react";
import { useReactToPrint } from 'react-to-print';
import { extractLabelData } from "@/core/services/xmlUtils";
import { logAuditEvent } from "@/infrastructure/api/auth";
import { toast } from "sonner";

interface LabelGeneratorProps {
  xmlData: any;
  showPreview?: boolean;
}

const LabelGenerator: React.FC<LabelGeneratorProps> = ({ xmlData, showPreview = true }) => {
  const labelRef = useRef<HTMLDivElement>(null);
  const [labelData, setLabelData] = React.useState<any>(null);
  
  React.useEffect(() => {
    if (xmlData) {
      try {
        const extractedData = extractLabelData(xmlData);
        setLabelData(extractedData);
      } catch (error) {
        console.error("Error extracting label data:", error);
        toast.error("Failed to extract label data from XML");
      }
    }
  }, [xmlData]);
  
  const handlePrint = useReactToPrint({
    content: () => labelRef.current,
    documentTitle: `Label - ${labelData?.productName || "Ration Formula"}`,
    onBeforeGetContent: () => {
      // You could add a loading state here
      return new Promise<void>((resolve) => {
        resolve();
      });
    },
    onAfterPrint: () => {
      logAuditEvent("label_printed", {
        productName: labelData?.productName,
        timestamp: new Date().toISOString()
      });
      toast.success("Label printed successfully");
    }
  });
  
  const handleDownload = () => {
    if (!labelRef.current) return;
    
    try {
      // Create a canvas from the label div
      const labelElement = labelRef.current;
      
      // Use html2canvas to create an image (this would need to be installed in a real project)
      // For this demo, we'll simply generate a text file with the label data
      const labelText = `
PRODUCT LABEL: ${labelData.productName}
====================================

MANUFACTURER: ${labelData.manufacturer}
ADDRESS: ${labelData.address}
REGISTRATION: ${labelData.registrationNumber}

CATEGORY: ${labelData.category} - ${labelData.subCategory}

GUARANTEED ANALYSIS:
${(labelData.guaranteedAnalysis || []).map((comp: any) => {
  const attrs = comp["@attributes"] || {};
  return `- ${attrs.name || "Unknown"}: ${attrs.minimum ? `Min ${attrs.minimum}` : ""} ${attrs.maximum ? `Max ${attrs.maximum}` : ""} ${attrs.unit || ""}`;
}).join('\n')}

INGREDIENTS:
${(labelData.ingredients || []).join(', ')}

FEEDING DIRECTIONS:
Animal Type: ${labelData.feedingDirections?.animalType || "Not specified"}
Animal Age: ${labelData.feedingDirections?.animalAge || "Not specified"}
Daily Amount: ${labelData.feedingDirections?.dailyAmount || "Not specified"}
Special Instructions: ${labelData.feedingDirections?.specialInstructions || "Not specified"}

STORAGE: ${labelData.storageInstructions || "Not specified"}
SHELF LIFE: ${labelData.shelfLife || "Not specified"}

Generated on: ${new Date().toLocaleString()}
      `;
      
      // Create a file and trigger download
      const blob = new Blob([labelText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(labelData.productName || "Ration_Label").replace(/\s+/g, '_')}_Label.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      logAuditEvent("label_downloaded", {
        productName: labelData?.productName,
        format: "txt",
        timestamp: new Date().toISOString()
      });
      
      toast.success("Label downloaded as text file");
    } catch (error) {
      console.error("Error downloading label:", error);
      toast.error("Failed to download label");
    }
  };
  
  const regenerateLabel = () => {
    if (xmlData) {
      try {
        const extractedData = extractLabelData(xmlData);
        setLabelData(extractedData);
        toast.success("Label regenerated successfully");
      } catch (error) {
        console.error("Error regenerating label:", error);
        toast.error("Failed to regenerate label");
      }
    }
  };
  
  if (!labelData) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Label Generator</CardTitle>
          <CardDescription>
            No data available for label generation
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Safely access guaranteedAnalysis with defensive checks
  const safeGuaranteedAnalysis = Array.isArray(labelData.guaranteedAnalysis) 
    ? labelData.guaranteedAnalysis 
    : [];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          <CardTitle>Ration Label Generator</CardTitle>
        </div>
        <CardDescription>
          Generate labels for your ration formula
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {showPreview && (
          <div className="mb-4">
            <div
              ref={labelRef}
              className="rounded-md border-2 border-dashed p-8 bg-white mx-auto w-full max-w-[680px]"
            >
              <div className="text-center border-b-2 border-black pb-2 mb-4">
                <h2 className="text-3xl font-bold mb-1">{labelData.productName || "Unnamed Product"}</h2>
                <div className="text-sm text-muted-foreground">
                  {labelData.category || "Uncategorized"} - {labelData.subCategory || ""}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg border-b mb-2">Guaranteed Analysis</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {safeGuaranteedAnalysis.map((comp: any, idx: number) => {
                        const attrs = comp["@attributes"] || {};
                        return (
                          <tr key={idx} className="border-b">
                            <td className="py-1 font-medium">{attrs.name || "Unknown"}</td>
                            <td className="py-1 text-right">
                              {attrs.minimum && `Min ${attrs.minimum}`}
                              {attrs.minimum && attrs.maximum && ", "}
                              {attrs.maximum && `Max ${attrs.maximum}`}
                              {" "}
                              {attrs.unit || ""}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg border-b mb-2">Feeding Directions</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Animal Type:</span> {String(labelData.feedingDirections?.animalType || "Not specified")}
                    </div>
                    <div>
                      <span className="font-medium">Animal Age:</span> {String(labelData.feedingDirections?.animalAge || "Not specified")}
                    </div>
                    <div>
                      <span className="font-medium">Daily Amount:</span> {String(labelData.feedingDirections?.dailyAmount || "Not specified")}
                    </div>
                    <div>
                      <span className="font-medium">Special Instructions:</span> {String(labelData.feedingDirections?.specialInstructions || "Not specified")}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold text-lg border-b mb-2">Ingredients</h3>
                <p className="text-sm">{Array.isArray(labelData.ingredients) 
                  ? labelData.ingredients.join(', ') 
                  : String(labelData.ingredients || "Not specified")}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold text-lg border-b mb-2">Storage & Handling</h3>
                <div className="text-sm space-y-2">
                  <div>{String(labelData.storageInstructions || "Not specified")}</div>
                  <div><span className="font-medium">Shelf Life:</span> {String(labelData.shelfLife || "Not specified")}</div>
                </div>
              </div>
              
              <div className="border-t-2 border-black pt-2 text-xs">
                <div className="flex flex-wrap justify-between">
                  <div>
                    <div><strong>{String(labelData.manufacturer || "Unknown Manufacturer")}</strong></div>
                    <div>{String(labelData.address || "Address not specified")}</div>
                  </div>
                  <div className="text-right">
                    <div>Registration: {String(labelData.registrationNumber || "Not specified")}</div>
                    <div>Batch: [BATCH NUMBER HERE]</div>
                    <div>Production Date: {new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print Label
          </Button>
          
          <Button variant="outline" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download Label
          </Button>
          
          <Button variant="secondary" onClick={regenerateLabel} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Regenerate Label
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabelGenerator;
