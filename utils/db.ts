import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.DB_URL;

let client: MongoClient | null = null;

export async function getClient() {
  if (!client) {
    if (!uri) {
      throw new Error('DB_URL environment variable is not set');
    }
    client = new MongoClient(uri!, {
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
