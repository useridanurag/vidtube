import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import User from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js"
const register = asyncHandler(async (req, res) => {
  const { fullName, username, email, password, confirmPassword } = req.body;

  if ([fullName, username, email, password, confirmPassword].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Each field is required.");
  }

  if (password !== confirmPassword) {
    throw new ApiError(409, "Password and Confirm Password must be same.");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User already exists.");
  }

  let avatarLocalPath;
  if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required.");
  }

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = await User.create({
    fullName, email, password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
  })

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(201).
    cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "Username or Email required.");
  }
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(400, "User does not exist.");
  }

  const isPasswordValid = user.checkPassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200).
    cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged In Successfully."));
})

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true })

  const options = {
    httpOnly: true,
    secure: true,
  }
  return res.status(200)
    .clearCookie(refreshToken, options)
    .clearCookie(accessToken, options)
    .json(new ApiResponse(200, {}, "User Logged out."));

})
export { register, login, logout }