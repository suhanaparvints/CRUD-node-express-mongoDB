import { v7 as uuidv7 } from "uuid";
import bcrypt from "bcrypt";
import { getDB } from "../config/db.js";
import collection from "../config/collection.js";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      return res.status(200).json({
        status: "OK",
        message: "Login successfully",
      });
    } else {
      throw new Error("invalid username or password");
    }
  } catch (error) {
    res.status(400).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, age, email, address, password, role } = req.body;
    if (!name || !email || !password) {
      throw new Error("give valid name,password, email ");
    }
    const userId = uuidv7();
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      userId,
      name,
      age,
      address,
      email,
      role,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await getDB().collection(collection.USERS_COLLECTION).insertOne(userData);
    console.log("result>>>", result);

    res.status(200).json({
      status: "ok",
      message: "successfully registered",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getDB().collection(collection.USERS_COLLECTION).findOne({ email });

    if (!user) {
      throw new Error("user not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new Error("invalid password");
    }

    const token = jwt.sign(
      {
        id: user.userId,
        email: user.email,
        name: user.name,
        role: "Admin", // just adding role manually
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    console.log("token>>> 🪙 ", token);

    res.status(200).json({
      status: "OK",
      message: "login successfully",
      token: token,
    });
  } catch (error) {
    console.log("error>>>", error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};