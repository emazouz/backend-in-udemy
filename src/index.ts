import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/dbConnection";
import userRoute from "./routers/userRoute";
dotenv.config({ path: ".env.local" });
const app = express();
app.use(express.json());
dbConnection();
app.use("/user", userRoute);

app.listen(process.env.PORT, () => {
  console.log(`connected succsefly ${process.env.PORT}`);
});
