import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { app } from "./src/app.js";

dotenv.config();

//DB connection
const PORT = process.env.PORT || 4000
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️  Server is listening on port : ${PORT}`);
    })
  })
  .catch((error) => {
    console.log(`MongoDB connection failed : ${error}`);
  })