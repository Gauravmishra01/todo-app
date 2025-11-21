import { MongoClient } from "mongodb";

const url =
  "mongodb+srv://gauravmishra92812_db_user:lEzctFbPckkzALeE@cluster0.dh4uylg.mongodb.net/?appName=Cluster0";

const dbName = "node-project";
export const collectionName = "todo";

const client = new MongoClient(url);

export const connection = async () => {
  const connect = await client.connect();
  return await connect.db(dbName);
};
