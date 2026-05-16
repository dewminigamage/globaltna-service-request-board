const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB for testing
beforeAll(async () => {
  try {
    // IMPORTANT: Always use a separate test database to avoid deleting production data
    let mongoUri = process.env.MONGODB_TEST_URI;
    
    if (!mongoUri) {
      // If no test URI is set, create one by appending '-test' to the production database name
      if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('globaltna')) {
        mongoUri = process.env.MONGODB_URI.replace('globaltna', 'globaltna-test');
      } else {
        // Fallback for local MongoDB
        mongoUri = 'mongodb://localhost:27017/globaltna-test';
      }
    }
    
    console.log('Connecting to test database...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✓ Test database connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
});

// Disconnect after all tests are done
afterAll(async () => {
  try {
    await mongoose.disconnect();
  } catch (err) {
    console.error('MongoDB disconnection failed:', err.message);
  }
});

// Set a timeout for tests (optional but useful for integration tests)
jest.setTimeout(30000);
