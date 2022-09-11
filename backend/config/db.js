import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config({ path: './config.env' });

const mongoUrl = process.env.DATABASE_LOCAL;
let _db;

const initDb = async (callback) => {
  if (_db) {
    console.log('Database is already initialized!'.blue);
    return callback(null, _db);
  }
  try {
    const client = await MongoClient.connect(mongoUrl);
    _db = client.db('ECommerce');
    callback(null, _db);
  } catch (err) {
    callback(err);
  }
};

const getDb = () => {
  if (!_db) {
    throw new Error('Database not initialized');
  }
  return _db;
};
export default {
  initDb,
  getDb
};
