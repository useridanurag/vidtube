import { asyncHandler } from "../utils/asyncHandler.js"
// import { User } from "../models/user.model.js"

const register = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  })
})

export {register}