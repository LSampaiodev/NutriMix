
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/utils/auth";
import Header from "@/components/Header";
import Sidebar, { SidebarToggle } from "@/components/Sidebar";
import LabelGenerator from "@/components/LabelGenerator";
import { getProcessedXmls, parseXML } from "@/utils/xmlUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, Search, Tag, Printer, ArrowRight, FileBarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Labels = () => {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedXmlId, setSelectedXmlId] = useState<string | null>(null);
  const [selectedXmlData, setSelectedXmlData] = useState<any>(null);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Get all processed XMLs
  const processedXmls = getProcessedXmls();
  
  // Filter XMLs based on search term
  const filteredXmls = processedXmls.filter(xml => 
    xml.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    xml.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleSelectXml = async (id: string) => {
    const selected = processedXmls.find(xml => xml.id === id);
    if (!selected) {
      toast.error("XML not found");
      return;
    }
    
    try {
      // Parse the XML content
      const parsed = await parseXML(selected.content);
      setSelectedXmlData(parsed);
      setSelectedXmlId(id);
    } catch (error) {
      console.error("Error parsing XML:", error);
      toast.error("Failed to parse XML data");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Labels</h1>
              <p className="text-muted-foreground">
                Generate and print labels for your ration formulas
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <SidebarToggle toggleSidebar={toggleSidebar} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="card-dashboard">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Available Formulas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{processedXmls.length}</div>
              </CardContent>
            </Card>
            
            <Card className="card-dashboard">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Tag className="mr-2 h-5 w-5 text-ration-accent" />
                  Labels Generated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.floor(processedXmls.length * 1.5)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-dashboard">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Printer className="mr-2 h-5 w-5 text-ration-secondary" />
                  Recently Printed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.floor(processedXmls.length * 0.7)}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Formula Library</CardTitle>
                <CardDescription>
                  Select a formula to generate its label
                </CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search formulas..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="px-4 py-2">
                    {filteredXmls.length > 0 ? (
                      filteredXmls.map((xml) => (
                        <div key={xml.id} className="mb-2">
                          <div 
                            className={`flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer ${
                              selectedXmlId === xml.id ? "bg-primary/10 border-primary" : ""
                            }`}
                            onClick={() => handleSelectXml(xml.id)}
                          >
                            <div className="flex items-center">
                              <FileBarChart2 className={`h-5 w-5 mr-3 ${
                                selectedXmlId === xml.id ? "text-primary" : "text-muted-foreground"
                              }`} />
                              <div>
                                <h4 className="font-medium truncate max-w-[180px]">{xml.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(xml.created).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div>
                              <Badge variant="outline" className="truncate max-w-[100px]">
                                {xml.category.split('-')[0].trim()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        {processedXmls.length === 0 
                          ? "No formulas available. Upload some from the Dashboard."
                          : "No matching formulas found."}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center">
                  <Tag className="mr-2 h-5 w-5 text-primary" />
                  <CardTitle>Label Generator</CardTitle>
                </div>
                <CardDescription>
                  {selectedXmlData 
                    ? `Generating label for ${selectedXmlData.LabelingInformation?.ProductName || selectedXmlData.Metadata?.Name || "Selected formula"}`
                    : "Select a formula from the library to generate a label"}
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                {selectedXmlData ? (
                  <LabelGenerator xmlData={selectedXmlData} />
                ) : (
                  <div className="text-center py-20 text-muted-foreground space-y-3">
                    <ArrowRight className="h-12 w-12 mx-auto rotate-180" />
                    <p>Select a formula from the left panel to generate its label</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Labels;
