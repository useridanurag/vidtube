import { Router } from "express"
import {
  register,
  login,
  logout,
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router
  .post("/register", upload.fields([
    { name: "avatar", maxCount: 1, },
    { name: "coverImage", maxCount: 1 }]), register)

  .post("/login", login)

  //Secure Route
  .post("/logout", verifyJwt, logout);


export default router