import { Schema, model } from "mongoose";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
  },
  watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
    }
  ],
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
  }
}, { timestamps: true });

// encrypt password before save in DB
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await argon2.hash(this.password);
  next();
})

//verify password 
UserSchema.methods.checkPassword = async function (password) {
  return await argon2.verify(this.password, password);
}

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    //payload Section
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    // Secret key section
    process.env.ACCESS_TOKEN_SECRET,
    // Expiry Section
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  )
}

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  )
}
const UserModel = model("User", UserSchema);

export default UserModel;