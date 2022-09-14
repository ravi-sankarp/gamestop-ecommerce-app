import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from 'dotenv';

config({ path: './config.env' });

const mongoUrl = process.env.DATABASE_CONNECTION;
let _db;

export const initDb = async (callback) => {
  if (_db) {
    console.log('Database is already initialized!'.blue);
    return callback(null, _db);
  }
  try {
    const client = await MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1
    });
    _db = client.db('ECommerce');
    callback(null, _db);
  } catch (err) {
    callback(err);
  }
};

export const getDb = () => {
  if (!_db) {
    throw new Error('Database not initialized');
  }
  return _db;
};
