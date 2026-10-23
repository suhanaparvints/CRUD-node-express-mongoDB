// db.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE;

const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("MongoDB connected");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

function getDB() {
  if (!db) throw new Error("Database not connected. Call connectDB() first.");
  return db;
}

export { connectDB, getDB };