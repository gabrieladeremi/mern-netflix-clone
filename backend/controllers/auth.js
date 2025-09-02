import User from "../models/user.js";
import bcrypt from "bcryptjs";

import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { username, email, password, image } = req.body;

        if(!email || !password || !username) {
            return res.status(400).json({success: false, message: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        } 

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

        const imageIndex = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        const newUser = new User({ username, email, password: hashedPassword, image: imageIndex });

        if(newUser) {
            const token = generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

        } else {
            res.status(400).json({ success: false, message: "User creation failed" });
        }
        

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...newUser._doc,
                password: "",
            }
        });

    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
} 

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: { ...user._doc, password: undefined },
        });

    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
} 

export const logout = async (req, res) => {
    try {
        res.clearCookie('jwt-netflix');
        res.status(200).json({ success: true, message: "User logged out successfully" });

    } catch (error) {
        console.log("Error logging out user:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const authCheck = async (req, res) => {
  try {
      res.status(200).json({ success: true, user: req.user });
  } catch (error) {
      console.log("Error checking user authentication:", error.message);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
}
