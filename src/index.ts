import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/dbConnection";
import userRoute from "./routers/userRoute";
import productRoute from "./routers/productRoute";
import { seedInitialProducts } from "./services/productService";

dotenv.config({ path: ".env.local" });
const app = express();
app.use(express.json());
dbConnection();

seedInitialProducts();

app.use("/user", userRoute);
app.use("/product", productRoute);

app.listen(process.env.PORT, () => {
  console.log(`connected succsefly ${process.env.PORT}`);
});
