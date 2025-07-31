import productRouter from "../routes/product";
import express from "express";

const app = express();
app.use(express.json());
app.use("/api/products", productRouter);

export default app;
