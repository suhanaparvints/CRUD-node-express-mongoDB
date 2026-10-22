import mongodb, { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

//get connection uri and database name
const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE;

//create MongoDB client using connection URI
const client = new MongoClient(uri);
let db;

//create a connectDB()
async function connectDB() {
  try {
    //connection to MongoDB
    await client.connect();
    db = client.db(dbName);
    console.log("MongoDB connected");
    return db;
  } catch (error) {
    console.log("MongoDb connection error", error.message);
    process.exit(1);
  }
}

function getDB() {
  if (!db) throw new Error("Database Not connected. call connectDB() first");
  return db;
}

export { connectDB, getDB };
