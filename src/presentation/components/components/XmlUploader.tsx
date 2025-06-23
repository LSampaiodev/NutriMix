import React, { useState, useRef } from "react";
import { Button } from "@/presentation/components/components/ui/button";
import { Input } from "@/presentation/components/components/ui/input";
import { Label } from "@/presentation/components/components/ui/label";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp, FileQuestion, Check, AlertCircle } from "lucide-react";
import { parseXML, validateXmlSecurity, saveProcessedXml, getSampleXmlData } from "@/utils/xmlUtils";
import { xmlUploadSchema, validateData } from "@/utils/validation";
import { Progress } from "@/components/ui/progress";
import { logAuditEvent } from "@/utils/auth";
import { toast } from "sonner";

interface XmlUploaderProps {
  onUploadSuccess: (data: any, xmlContent: string) => void;
}

const XmlUploader: React.FC<XmlUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [xmlFormat, setXmlFormat] = useState<"standard" | "brazilian">("standard");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      setFile(null);
      return;
    }

    const selectedFile = selectedFiles[0];
    
    // Validate the file
    const validation = validateData(xmlUploadSchema, { file: selectedFile });
    if (!validation.success) {
      setError(Object.values(validation.errors || {}).join(", "));
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setValidationStatus('idle');
    setValidationIssues([]);
  };

  const validateFile = async () => {
    if (!file) {
      setError("Please select an XML file first");
      return;
    }

    setValidationStatus('validating');
    setProgress(10);

    try {
      // Read the file content
      const content = await readFileContent(file);
      setProgress(30);
      
      // Check for security issues
      const securityCheck = validateXmlSecurity(content);
      setProgress(60);
      
      if (!securityCheck.valid) {
        setValidationStatus('invalid');
        setValidationIssues(securityCheck.issues);
        logAuditEvent("xml_validation_failed", {
          filename: file.name,
          issues: securityCheck.issues
        });
        setProgress(100);
        return;
      }
      
      // Try to parse the XML to ensure it's valid
      await parseXML(content);
      setProgress(90);
      
      // If we made it here, the file is valid
      setValidationStatus('valid');
      logAuditEvent("xml_validation_success", { filename: file.name });
      toast.success("XML validado com sucesso");
      setProgress(100);
    } catch (err) {
      console.error("XML validation error:", err);
      setValidationStatus('invalid');
      setValidationIssues([`XML parsing error: ${err instanceof Error ? err.message : String(err)}`]);
      logAuditEvent("xml_validation_error", {
        filename: file.name,
        error: err instanceof Error ? err.message : String(err)
      });
      setProgress(100);
    }
  };

  const processFile = async () => {
    if (!file) {
      setError("Please select and validate an XML file first");
      return;
    }
    
    if (validationStatus !== 'valid') {
      setError("Please validate the XML file before processing");
      return;
    }
    
    setIsUploading(true);
    setProgress(10);
    
    try {
      // Read the file content
      const content = await readFileContent(file);
      setProgress(30);
      
      // Parse XML
      const parsedData = await parseXML(content);
      setProgress(60);
      
      // Save processed XML
      await saveProcessedXml(content, parsedData);
      setProgress(80);
      
      // Call the success callback
      onUploadSuccess(parsedData, content);
      
      // Log the event
      logAuditEvent("xml_processed", { filename: file.name });
      
      // Reset form
      setFile(null);
      setValidationStatus('idle');
      setProgress(100);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      toast.success("XML processado com sucesso");
    } catch (err) {
      console.error("XML processing error:", err);
      setError(`Error processing XML: ${err instanceof Error ? err.message : String(err)}`);
      logAuditEvent("xml_processing_error", {
        filename: file.name,
        error: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setIsUploading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("Failed to read file content"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      
      reader.readAsText(file);
    });
  };

  const loadSampleData = () => {
    const sampleData = getSampleXmlData(xmlFormat);
    setValidationStatus('validating');
    setProgress(30);
    
    setTimeout(() => {
      try {
        // Check for security issues in sample data
        const securityCheck = validateXmlSecurity(sampleData);
        setProgress(60);
        
        if (!securityCheck.valid) {
          setValidationStatus('invalid');
          setValidationIssues(securityCheck.issues);
          setProgress(100);
          return;
        }
        
        // Sample data should be valid
        setValidationStatus('valid');
        setProgress(100);
        
        // Process the sample data
        parseXML(sampleData).then(parsedData => {
          onUploadSuccess(parsedData, sampleData);
          logAuditEvent("sample_data_loaded", { format: xmlFormat });
          toast.success(`Dados de amostra de ${xmlFormat === "brazilian" ? "formato brasileiro" : "formato padrão"} carregados com sucesso`);
        });
      } catch (err) {
        console.error("Error loading sample data:", err);
        setError(`Error loading sample data: ${err instanceof Error ? err.message : String(err)}`);
      }
    }, 800);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Upload de XML</CardTitle>
        <CardDescription>
          Faça upload de um arquivo XML de fórmula de ração para processamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="xml-file">Arquivo XML de Fórmula</Label>
            <Input
              ref={fileInputRef}
              id="xml-file"
              type="file"
              accept=".xml,text/xml"
              onChange={handleFileChange}
              disabled={isUploading || validationStatus === 'validating'}
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="xml-format">Formato do XML</Label>
            <Select
              value={xmlFormat}
              onValueChange={(value: "standard" | "brazilian") => setXmlFormat(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Formato Padrão Internacional</SelectItem>
                <SelectItem value="brazilian">Formato Brasileiro</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {xmlFormat === "brazilian" 
                ? "Formato adaptado para o padrão brasileiro de prescrição de ração"
                : "Formato padrão internacional de fórmula de ração"}
            </p>
          </div>
          
          {validationStatus === 'validating' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Validando XML...</span>
                <span className="text-sm">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          
          {validationStatus === 'valid' && (
            <Alert className="bg-ration-success/10 border-ration-success">
              <Check className="h-4 w-4 text-ration-success" />
              <AlertDescription className="text-ration-success">
                XML validado com sucesso. Pronto para processar.
              </AlertDescription>
            </Alert>
          )}
          
          {validationStatus === 'invalid' && (
            <div className="space-y-2">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Falha na validação do XML. Verifique os problemas abaixo.
                </AlertDescription>
              </Alert>
              <ul className="list-disc pl-5 text-sm text-destructive space-y-1">
                {validationIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={loadSampleData}
          disabled={isUploading}
        >
          <FileQuestion className="mr-2 h-4 w-4" />
          Carregar Amostra {xmlFormat === "brazilian" ? "Brasileira" : "Padrão"}
        </Button>
        
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={validateFile}
            disabled={!file || isUploading || validationStatus === 'validating'}
          >
            Validar XML
          </Button>
          
          <Button
            onClick={processFile}
            disabled={
              !file || 
              isUploading || 
              validationStatus !== 'valid'
            }
            className="relative"
          >
            {isUploading ? (
              <>
                <span className="opacity-0">
                  <FileUp className="mr-2 h-4 w-4" />
                  Processar XML
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  Processando... {progress}%
                </span>
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Processar XML
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default XmlUploader;
