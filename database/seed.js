/**
 * CineBook — MongoDB Seed Script
 * 
 * Run this script with Node.js + MongoDB driver to populate the database
 * with sample data. Requires a running MongoDB instance.
 * 
 * Usage:
 *   node database/seed.js
 * 
 * Prerequisites:
 *   npm install mongodb
 *   Set MONGODB_URI environment variable (default: mongodb://localhost:27017)
 */

// In the current demo, data is loaded from src/data/*.js into localStorage.
// To use MongoDB in production, uncomment and configure the code below:

/*
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'cinebook';

async function seed() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Import data
    const movies = require('../src/data/movies.js').default;
    const cinemas = require('../src/data/cinemas.js').default;
    const shows = require('../src/data/shows.js').default;
    const users = require('../src/data/users.js').default;
    
    // Clear existing data
    await db.collection('movies').deleteMany({});
    await db.collection('cinemas').deleteMany({});
    await db.collection('shows').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('bookings').deleteMany({});
    
    // Insert data
    if (movies.length) await db.collection('movies').insertMany(movies);
    console.log(`Inserted ${movies.length} movies`);
    
    if (cinemas.length) await db.collection('cinemas').insertMany(cinemas);
    console.log(`Inserted ${cinemas.length} cinemas`);
    
    if (shows.length) await db.collection('shows').insertMany(shows);
    console.log(`Inserted ${shows.length} shows`);
    
    if (users.length) await db.collection('users').insertMany(users);
    console.log(`Inserted ${users.length} users`);
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('movies').createIndex({ status: 1 });
    await db.collection('shows').createIndex({ movieId: 1, date: 1 });
    await db.collection('shows').createIndex({ cinemaId: 1, date: 1 });
    await db.collection('bookings').createIndex({ userId: 1 });
    await db.collection('bookings').createIndex({ showId: 1 });
    console.log('Indexes created');
    
    console.log('Seed complete!');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await client.close();
  }
}

seed();
*/

console.log('CineBook MongoDB Seed Script');
console.log('---');
console.log('The demo currently uses localStorage for data persistence.');
console.log('To use MongoDB, uncomment the seed code in this file and install the mongodb driver.');
console.log('');
console.log('Sample data files:');
console.log('  - src/data/movies.js    (10 movies)');
console.log('  - src/data/cinemas.js   (5 cinemas)');
console.log('  - src/data/shows.js     (auto-generated shows)');
console.log('  - src/data/users.js     (3 users including admin)');
