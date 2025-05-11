import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/dbConnection";
import userRoute from "./routers/userRoute";
import productRoute from "./routers/productRoute";
import cardRoute from './routers/cardRoute';
import { seedInitialProducts } from "./services/productService";
import cors from 'cors'

dotenv.config({ path: ".env.local" });
const app = express();
app.use(express.json());
dbConnection();

seedInitialProducts();
app.use(cors());
app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/card", cardRoute);

app.listen(process.env.PORT, () => {
  console.log(`connected succsefly ${process.env.PORT}`);
});
