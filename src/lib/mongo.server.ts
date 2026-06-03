import { MongoClient } from "mongodb";

let clientPromise: Promise<MongoClient> | undefined;

export async function getMongoDb() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!clientPromise) {
    clientPromise = new MongoClient(uri).connect();
  }

  const client = await clientPromise;
  return client.db("sinhasapp");
}
