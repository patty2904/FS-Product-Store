import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv"

import productRoutes from "./routes/productRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
//MIDDLERWARE
app.use(express.json());
app.use(cors());
//Helmet is a security middleware that helps you protect your app by setting
//various HTTP headers
app.use(helmet()); 
//logs the requests
app.use(morgan("dev"));

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port ", PORT);
})