const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection Details:', {
      dbUri: process.env.MONGODB_URI ? '<redacted>' : 'N/A'
    });
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'mayacode',
    });
    
    console.log('MongoDB Connection Details:', {
      dbName: mongoose.connection.db.databaseName,
      readyState: mongoose.connection.readyState
    });

    // Handle indexes after connection
    const db = mongoose.connection.db;
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      for (const collection of collections) {
        const collectionName = collection.name;
        const indexes = await mongoose.connection.db.collection(collectionName).listIndexes().toArray();
        // console.log('Current indexes:', indexes);

        // Check and drop userId_1 index if it exists
        const userIdIndex = indexes.find(index => index.name === 'userId_1');
        if (userIdIndex) {
          // console.log('Dropping userId_1 index...');
          await mongoose.connection.db.collection(collectionName).dropIndex('userId_1');
          // console.log('userId_1 index dropped successfully');
        }

        // Check and create phone_1 index if it doesn't exist and the collection is UserProfile
        const phoneIndex = indexes.find(index => index.name === 'phone_1');
        if (!phoneIndex && collectionName === 'userprofiles') {
          // console.log('Creating phone_1 index...');
          await mongoose.connection.db.collection(collectionName).createIndex({ phone: 1 });
          // console.log('phone_1 index created successfully');
        }
      }
    } catch (indexError) {
      console.error('Index operation error:', indexError);
    }

  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;