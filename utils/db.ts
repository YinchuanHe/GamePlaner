import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://yinchuan:HYChyc86128958!!@cluster0.kb5m8qt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client: MongoClient | null = null;

export async function getClient() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  }
  return client;
}
