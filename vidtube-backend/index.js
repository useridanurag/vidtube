import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/config/db.js";

dotenv.config();

//Variables
const app = express();
const PORT = process.env.PORT || 4000;

//DB connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port : ${PORT}`);
    })
  })
  .catch((error) => {
    console.log(`MongoDB connection failed : ${error}`);
  })