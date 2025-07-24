import { XmlUploader } from "@/components/xml-uploader"
import { XmlViewer } from "@/components/xml-viewer"

export default function LabelsPage() {
  return (
    <div className="space-y-6">
      <XmlUploader />
      <XmlViewer />
    </div>
  )
}
