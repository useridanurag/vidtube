import { Router } from "express"
import {
  register,
  login,
  logout,
  refreshAccessToken,
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
  .post("/logout", verifyJwt, logout)
  .post("/refresh-token", refreshAccessToken)


export default router