import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import CryptoJS from "crypto-js";

const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'None' : 'Lax', // ❗ 'None' required for cross-origin
  maxAge: 24 * 60 * 60 * 1000
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Please enter a strong password" });
    }

    const hashedPassword = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET_KEY).toString();
    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: "1d" });

   
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({ success: true, message: "User registered successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error in creating user" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8);
    if (decryptedPassword !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: "1d" });

    
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(200).json({ success: true, message: "Login successful" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Unable to authenticate you" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export { loginUser, registerUser ,logoutUser};
