import { MongoClient, Db } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI!);
let db: Db | null = null;

export const connectDB = async () => {
  if (db) return db;
  await client.connect();
  db = client.db(process.env.DB_NAME);
  return db;
};
