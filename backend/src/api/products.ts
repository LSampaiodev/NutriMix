import productRouter from "../routes/product";
import authRouter from "../routes/auth";
import usersRouter from "../routes/users";
import certificadosRouter from "../routes/certificados";
import listagensRouter from "../routes/listagens";
import xmlRouter from "../routes/xml";
import historicoRouter from "../routes/historico";
import relatoriosRouter from "../routes/relatorios";
import express from "express";

const app = express();
app.use(express.json());
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/certificados", certificadosRouter);
app.use("/api/listagens", listagensRouter);
app.use("/api/xml", xmlRouter);
app.use("/api/historico", historicoRouter);
app.use("/api/relatorios", relatoriosRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
export default app;
