import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import {app} from "express";

dotenv.config();

//DB connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port : ${process.env.PORT || 4000}`);
    })
  })
  .catch((error) => {
    console.log(`MongoDB connection failed : ${error}`);
  })