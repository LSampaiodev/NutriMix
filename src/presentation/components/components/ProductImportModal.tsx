import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/presentation/components/components/ui/dialog";
import ProductImport from "@/presentation/pages/pages/ProductImport";

const ProductImportModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="btn btn-primary px-6 py-3 text-base font-semibold rounded-md">Teste XML</button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Teste XML via Upload</DialogTitle>
        </DialogHeader>
        <ProductImport />
      </DialogContent>
    </Dialog>
  );
};

export default ProductImportModal; 