import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/infrastructure/api/auth";
import Header from "@/presentation/components/components/Header";
import SidebarContent from "@/presentation/components/components/Sidebar";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHamburgerTrigger,
} from "@/presentation/components/components/ui/sidebar";
import LabelGenerator from "@/presentation/components/components/LabelGenerator";
import { getProcessedXmls, parseXML } from "@/core/services/xmlUtils";
import { Button } from "@/presentation/components/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/components/ui/card";
import { Input } from "@/presentation/components/components/ui/input";
import { ScrollArea } from "@/presentation/components/components/ui/scroll-area";
import { Separator } from "@/presentation/components/components/ui/separator";
import { FileText, Search, Tag, Printer, ArrowRight, FileBarChart2 } from "lucide-react";
import { Badge } from "@/presentation/components/components/ui/badge";
import { toast } from "sonner";
import ProductImportModal from "@/presentation/components/components/ProductImportModal";

const Labels = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedXmlId, setSelectedXmlId] = React.useState<string | null>(null);
  const [selectedXmlData, setSelectedXmlData] = React.useState<any>(null);

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
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar: ocupa espaço lateral apenas em md+ */}
        <Sidebar className="hidden md:block">
          <SidebarContent />
        </Sidebar>
        {/* Sidebar Drawer para mobile */}
        <Sidebar className="md:hidden fixed inset-0 z-40">
          <SidebarContent />
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 w-full flex flex-col overflow-y-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Labels</h1>
                <p className="text-muted-foreground">
                  Gere e imprima etiquetas para suas fórmulas de ração
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <ProductImportModal />
                <SidebarHamburgerTrigger />
                <SidebarTrigger />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="card-dashboard">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Fórmulas Disponíveis
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
                    Etiquetas Geradas
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
                    Recentemente Imprimidas
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
                  <CardTitle>Biblioteca de Fórmulas</CardTitle>
                  <CardDescription>
                    Selecione uma fórmula para gerar sua etiqueta
                  </CardDescription>
                  <div className="relative mt-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar fórmulas..."
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
                            ? "Nenhuma fórmula disponível. Carregue algumas do Painel."
                            : "Nenhuma fórmula correspondente encontrada."}
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
                    <CardTitle>Gerador de Etiquetas</CardTitle>
                  </div>
                  <CardDescription>
                    {selectedXmlData 
                      ? `Gerando etiqueta para ${selectedXmlData.LabelingInformation?.ProductName || selectedXmlData.Metadata?.Name || "Fórmula selecionada"}`
                      : "Selecione uma fórmula da biblioteca para gerar uma etiqueta"}
                  </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  {selectedXmlData ? (
                    <LabelGenerator xmlData={selectedXmlData} />
                  ) : (
                    <div className="text-center py-20 text-muted-foreground space-y-3">
                      <p>Nenhuma fórmula selecionada</p>
                      <p>Selecione uma fórmula à esquerda para gerar a etiqueta</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Labels;
