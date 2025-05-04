import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/ecommerce")
    .then((con) =>
      console.log(`Connection Successfly -> ${con.connection.host}`)
    )
    .catch((err) => console.log(`Faild conncting to database -> ${err}`));
}

export default dbConnection;
