import { ObjectId } from "mongodb";
import collection from "../config/collection.js";
import { getDB } from "../config/db.js";

// getting all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await getDB()
      .collection(collection.USERS_COLLECTION)
      .find({}, { project: { password: 0 } })
      .toArray();
    console.log("users", users);
    res.status(200).json({
      status: "OK",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      message: error.message,
    });
  }
};

//update user

export const nameUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getDB()
      .collection(collection.USERS_COLLECTION)
      .updateOne({ _id: new ObjectId(id) }, { $set: { name: req.body.name } });
    if (!user) {
      throw new Error("user not found");
    }
    res.status(200).json({
      status: "ok",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      message: error.message,
    });
  }
};

//update all
export const replaceUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getDB()
      .collection(collection.USERS_COLLECTION)
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            name: req.body.name,
            age: req.body.age,
            address: req.body.address,
            email: req.body.email,
            password: req.body.password,
            updatedAt: new Date(),
          },
        },
      );
    if (!user) {
      throw new Error("user not found");
    }

    res.status(200).json({
      status: "OK",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      message: error.message,
    });
  }
};

//delete
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getDB()
      .collection(collection.USERS_COLLECTION)
      .deleteOne({ _id: new ObjectId(id) });
    if (!user) {
      throw new Error("user not found");
    }
    res.status(200).json({
      status: "ok",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};