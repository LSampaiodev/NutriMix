import React from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/presentation/components/components/ui/tabs";
import { useAuth } from "@/infrastructure/api/auth";
import Header from "@/presentation/components/components/Header";
import SidebarContent from "@/presentation/components/components/Sidebar";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHamburgerTrigger,
} from "@/presentation/components/components/ui/sidebar";
import XmlUploader from "@/presentation/components/components/XmlUploader";
import XmlViewer from "@/presentation/components/components/XmlViewer";
import LabelGenerator from "@/presentation/components/components/LabelGenerator";
import { getProcessedXmls } from "@/core/services/xmlUtils";
import { Badge } from "@/presentation/components/components/ui/badge";
import { Button } from "@/presentation/components/components/ui/button";
import { FileText, Clock, BarChart3, Clipboard, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [xmlData, setXmlData] = React.useState<any>(null);
  const [xmlContent, setXmlContent] = React.useState<string>("");

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const processedXmls = getProcessedXmls();
  const recentXmls = processedXmls.slice(0, 5);

  const handleXmlUploadSuccess = (data: any, content: string) => {
    setXmlData(data);
    setXmlContent(content);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar>
          <SidebarContent />
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Gerencie suas fórmulas de ração e gere etiquetas
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <SidebarHamburgerTrigger />
                <SidebarTrigger />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="card-dashboard">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    XMLs Processados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{processedXmls.length}</div>
                  <p className="text-muted-foreground text-sm">Total de arquivos XML processados</p>
                </CardContent>
              </Card>
              <Card className="card-dashboard">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Clipboard className="mr-2 h-5 w-5 text-ration-accent" />
                    Etiquetas Geradas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {Math.floor(processedXmls.length * 1.5)}
                  </div>
                  <p className="text-muted-foreground text-sm">Total de etiquetas geradas</p>
                </CardContent>
              </Card>
              <Card className="card-dashboard">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-ration-secondary" />
                    Disponibilidade do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">99.9%</div>
                  <p className="text-muted-foreground text-sm">Disponibilidade do Sistema</p>
                </CardContent>
              </Card>
            </div>
            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">Upload XML</TabsTrigger>
                <TabsTrigger value="view">Visualizar Dados</TabsTrigger>
                <TabsTrigger value="generate">Gerar Etiqueta</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="space-y-6">
                <XmlUploader onUploadSuccess={handleXmlUploadSuccess} />
                {recentXmls.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Fórmulas Recentes</CardTitle>
                      <CardDescription>
                        Fórmulas de ração processadas recentemente
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentXmls.map((xml) => (
                          <div
                            key={xml.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                            onClick={() => {
                              // In a real app, this would load the XML data
                              alert(`Would load XML with ID: ${xml.id}`);
                            }}
                          >
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-primary mr-3" />
                              <div>
                                <h4 className="font-medium">{xml.name}</h4>
                                <p className="text-xs text-muted-foreground">{new Date(xml.created).toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                {xml.category}
                              </Badge>
                              <Button variant="ghost" size="icon">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="view">
                <XmlViewer data={xmlData} rawXml={xmlContent} />
              </TabsContent>
              <TabsContent value="generate">
                <LabelGenerator xmlData={xmlData} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
