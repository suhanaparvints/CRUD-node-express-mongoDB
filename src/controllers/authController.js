import { v7 as uuidV7 } from "uuid";
import bcrypt from "bcrypt";
import { getDB } from "../config/db.js";
import collection from "../config/collection.js";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  console.log("adminLogin Function Called");
  try {
    const { username, password } = req.body;
    // console.log(username,password);

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      return res.status(200).json({
        status: "OK",
        message: "adminLogin Success",
      });
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    res.status(400).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

export const registerUser = async (req, res) => {
  console.log("registerUser Function Called");
  try {
    const { name, age, address, email, password,role } = req.body;
    // console.log(name,age,address,email,password);

    if (!name || !email || !password) {
      throw new Error("name, email, and password fields are required");
    }

    //uuid created
    const userId = uuidV7();
    console.log({ userId });

    //password hashed
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log({ hashedPassword });

    const userData = {
      userId,
      name,
      age,
      address,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updateAt: new Date(),
    };

    // console.log("user",userData);
    // console.log("database",getDB());

    const result = await getDB().collection(collection.USERS_COLLECTION).insertOne(userData);

    res.status(200).json({
      status: "OK",
      message: "registerUser Success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  console.log("userLogin Function Called");
  console.log("req.body>>>", req.body);
  try {
    const { email, password } = req.body;
    // console.log(username,password);

    const user = await getDB().collection(collection.USERS_COLLECTION).findOne({ email });
    console.log("user>>", user);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    console.log("isPasswordMatch", isPasswordMatch);

    if (!isPasswordMatch) {
      throw new Error("Invalid Password");
    }

    const token = jwt.sign(
      {
        id: user.userId,
        name: user.name,
        email: user.email,
        role: "Admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    console.log("token>>", token);

    res.status(200).json({
      status: "OK",
      message: "userLogin Successful",
      token: token,
    });
  } catch (error) {
    console.log("error", error.message);
    res.status(400).json({
      status: "ERROR",
      message: error.message,
    });
  }
};
