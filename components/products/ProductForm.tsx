import { useState } from "react";
import { XmlImportButton } from "./XmlImportButton";

export function ProductForm() {
  const [form, setForm] = useState({
    codigoProduto: "",
    nomeProduto: "",
    classificacao: "",
    formaFisica: "",
    prazoValidade: "",
    // ...outros campos
  });

  const handleXmlImport = (data: any) => {
    setForm((prev) => ({
      ...prev,
      codigoProduto: data.codigoProduto || "",
      nomeProduto: data.nomeProduto || "",
      classificacao: data.classificacao || "",
      formaFisica: data.formaFisica || "",
      prazoValidade: data.prazoValidade || "",
      // ...outros campos
    }));
  };

  return (
    <form>
      <XmlImportButton onImport={handleXmlImport} />
      <input
        value={form.codigoProduto}
        onChange={e => setForm(f => ({ ...f, codigoProduto: e.target.value }))}
        placeholder="Código do Produto"
      />
      <input
        value={form.nomeProduto}
        onChange={e => setForm(f => ({ ...f, nomeProduto: e.target.value }))}
        placeholder="Nome do Produto"
      />
      {/* ...outros campos */}
      <button type="submit">Salvar</button>
    </form>
  );
}