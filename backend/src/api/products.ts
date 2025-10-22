import productRouter from "../routes/product";
import express from "express";

const app = express();
app.use(express.json());
app.use("/api/products", productRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
export default app;
