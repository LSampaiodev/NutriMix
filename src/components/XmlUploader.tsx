
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
      toast.success("XML validated successfully");
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
      
      toast.success("XML processed successfully");
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
    const sampleData = getSampleXmlData();
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
          logAuditEvent("sample_data_loaded", {});
          toast.success("Sample data loaded successfully");
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
        <CardTitle>XML Upload</CardTitle>
        <CardDescription>
          Upload a ration formula XML file for processing
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
            <Label htmlFor="xml-file">Formula XML File</Label>
            <Input
              ref={fileInputRef}
              id="xml-file"
              type="file"
              accept=".xml,text/xml"
              onChange={handleFileChange}
              disabled={isUploading || validationStatus === 'validating'}
            />
          </div>
          
          {validationStatus === 'validating' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Validating XML...</span>
                <span className="text-sm">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          
          {validationStatus === 'valid' && (
            <Alert className="bg-ration-success/10 border-ration-success">
              <Check className="h-4 w-4 text-ration-success" />
              <AlertDescription className="text-ration-success">
                XML validated successfully. Ready to process.
              </AlertDescription>
            </Alert>
          )}
          
          {validationStatus === 'invalid' && (
            <div className="space-y-2">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  XML validation failed. Please check the issues below.
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
          Load Sample
        </Button>
        
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={validateFile}
            disabled={!file || isUploading || validationStatus === 'validating'}
          >
            Validate XML
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
                  Process XML
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  Processing... {progress}%
                </span>
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Process XML
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default XmlUploader;
