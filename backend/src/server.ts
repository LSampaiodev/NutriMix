import express from "express";
import productRouter from "./routes/product";

const app = express();
app.use(express.json());
app.use("/api/products", productRouter);

const PORT = 4000; // ou a porta que preferir
app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});