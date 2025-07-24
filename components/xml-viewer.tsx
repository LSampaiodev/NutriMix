"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Code } from "lucide-react"

interface XmlFile {
  id: string
  name: string
  uploadDate: string
  size: string
  content: string
}

const sampleXmlFiles: any[] = []
// TODO: Buscar XMLs reais do back-end

export function XmlViewer() {
  const [selectedFile, setSelectedFile] = useState<XmlFile | null>(null)

  const viewFile = (file: XmlFile) => {
    setSelectedFile(file)
  }

  const downloadFile = (file: XmlFile) => {
    const blob = new Blob([file.content], { type: "application/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Arquivos XML Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sampleXmlFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{file.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.uploadDate}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">XML</Badge>
                  <Button variant="outline" size="sm" onClick={() => viewFile(file)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadFile(file)}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Visualizando: {selectedFile.name}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)}>
                Fechar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 overflow-auto">
              <pre className="text-sm">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
