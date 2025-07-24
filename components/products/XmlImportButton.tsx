import React from "react";

type Props = {
  onImport: (data: any) => void;
};

export function XmlImportButton({ onImport }: Props) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/xml/import", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      onImport(data);
    } else {
      alert("Erro ao importar XML");
    }
  };

  return (
    <label>
      <button type="button" className="btn btn-secondary">Importar XML</button>
      <input
        type="file"
        accept=".xml"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </label>
  );
}