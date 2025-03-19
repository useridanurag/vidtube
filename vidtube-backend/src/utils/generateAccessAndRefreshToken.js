import { ApiError } from "./ApiError"
import User from "../models/user.model.js"
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const accessToken = generateAccessToken();
    const refreshToken = generateRefreshToken();

    const user = await User.findById(userId);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating Access and Refresh token.");
  }
}

export { generateAccessAndRefreshToken };