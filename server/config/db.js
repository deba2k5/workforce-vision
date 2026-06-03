import { MongoClient } from 'mongodb';

let db = null;

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not configured');
    }

    const client = new MongoClient(uri);
    await client.connect();
    db = client.db('sinhasapp');
    
    console.log('Connected to MongoDB');
    
    // Create indexes
    await createIndexes();
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

async function createIndexes() {
  try {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    // Create indexes for employee_work_data
    if (collectionNames.includes('employee_work_data')) {
      const workDataCollection = db.collection('employee_work_data');
      await workDataCollection.createIndex({ employeeId: 1, date: 1 });
      await workDataCollection.createIndex({ createdAt: 1 });
    }

    // Create indexes for login_sessions
    if (collectionNames.includes('login_sessions')) {
      const loginCollection = db.collection('login_sessions');
      await loginCollection.createIndex({ employeeId: 1, loginTime: -1 });
      await loginCollection.createIndex({ createdAt: 1 });
    }

    // Create indexes for task_records
    if (collectionNames.includes('task_records')) {
      const taskCollection = db.collection('task_records');
      await taskCollection.createIndex({ employeeId: 1, createdAt: -1 });
      await taskCollection.createIndex({ status: 1 });
    }

    console.log('Database indexes created');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}
