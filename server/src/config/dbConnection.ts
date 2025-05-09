import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.URL_DATABASE || "")
    .then((con) =>
      console.log(`Connection Successfly -> ${con.connection.host}`)
    )
    .catch((err) => console.log(`Faild conncting to database -> ${err}`));
};

export default dbConnection;
