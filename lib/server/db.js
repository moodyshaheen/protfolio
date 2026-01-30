import mongoose from 'mongoose';

const globalForMongoose = globalThis;

// Cache the connection across hot-reloads in dev.
if (!globalForMongoose.__mongoose) {
  globalForMongoose.__mongoose = { conn: null, promise: null };
}

export async function connectDb() {
  const cache = globalForMongoose.__mongoose;

  if (cache.conn) return cache.conn;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined');
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri).then((m) => m);
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

