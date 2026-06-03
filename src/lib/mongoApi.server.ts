import { getMongoDb } from '../mongo.server';
import { ObjectId } from 'mongodb';

export interface MongoDocumentBase {
  _id?: ObjectId;
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Generic save function for any collection
 */
export async function saveDocument(collectionName: string, data: any) {
  try {
    const db = await getMongoDb();
    const collection = db.collection(collectionName);

    const document = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(document);
    return { success: true, id: result.insertedId };
  } catch (error: any) {
    console.error(`Error saving to ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Generic update function for any collection
 */
export async function updateDocument(collectionName: string, itemId: string, updates: any) {
  try {
    const db = await getMongoDb();
    const collection = db.collection(collectionName);

    const result = await collection.updateOne(
      { _id: new ObjectId(itemId) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error: any) {
    console.error(`Error updating in ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Generic delete function for any collection
 */
export async function deleteDocument(collectionName: string, itemId: string) {
  try {
    const db = await getMongoDb();
    const collection = db.collection(collectionName);

    const result = await collection.deleteOne({ _id: new ObjectId(itemId) });
    return { success: result.deletedCount > 0 };
  } catch (error: any) {
    console.error(`Error deleting from ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Query documents for a specific employee
 */
export async function queryDocuments(collectionName: string, employeeId: string, filters: any = {}) {
  try {
    const db = await getMongoDb();
    const collection = db.collection(collectionName);

    const data = await collection
      .find({ employeeId, ...filters })
      .sort({ createdAt: -1 })
      .toArray();

    return { success: true, data };
  } catch (error: any) {
    console.error(`Error querying ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Track employee activity
 */
export async function trackEmployeeActivity(data: {
  employeeId: string;
  employeeName: string;
  email: string;
  date: string;
  timestamp: string;
  status: 'active' | 'break' | 'offline';
  tasksCompleted?: number;
  productivity?: number;
  workType?: string;
}) {
  try {
    const db = await getMongoDb();
    const collection = db.collection('employee_activity');

    const activityData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(activityData);
    return { success: true, activityId: result.insertedId };
  } catch (error: any) {
    console.error('Error tracking activity:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Record employee login
 */
export async function recordLogin(data: {
  employeeId: string;
  employeeName: string;
  date: string;
  loginTime: string;
  location?: any;
}) {
  try {
    const db = await getMongoDb();
    const collection = db.collection('login_sessions');

    const loginData = {
      ...data,
      status: 'active',
      createdAt: new Date(),
    };

    const result = await collection.insertOne(loginData);
    return { success: true, sessionId: result.insertedId };
  } catch (error: any) {
    console.error('Error recording login:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Record employee logout
 */
export async function recordLogout(data: {
  sessionId: string;
  logoutTime: string;
  duration: number;
}) {
  try {
    const db = await getMongoDb();
    const collection = db.collection('login_sessions');

    const result = await collection.updateOne(
      { _id: new ObjectId(data.sessionId) },
      {
        $set: {
          logoutTime: data.logoutTime,
          duration: data.duration,
          status: 'completed',
          updatedAt: new Date(),
        },
      }
    );

    return { success: result.modifiedCount > 0 };
  } catch (error: any) {
    console.error('Error recording logout:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get employee activity summary
 */
export async function getActivitySummary(employeeId: string, date: string) {
  try {
    const db = await getMongoDb();
    const workCollection = db.collection('employee_work_data');
    const loginCollection = db.collection('login_sessions');

    const workData = await workCollection
      .find({ employeeId, date })
      .toArray();

    const loginData = await loginCollection
      .find({ employeeId, date })
      .toArray();

    const totalHoursWorked = loginData.reduce((sum, login) => sum + (login.duration || 0), 0) / 60;
    const totalTasksCompleted = workData.reduce((sum, work) => sum + (work.tasksCompleted || 0), 0);
    const avgProductivity = workData.length > 0
      ? Math.round(workData.reduce((sum, work) => sum + (work.productivity || 0), 0) / workData.length)
      : 0;

    return {
      success: true,
      summary: {
        date,
        employeeId,
        totalHoursWorked: Math.round(totalHoursWorked * 100) / 100,
        totalTasksCompleted,
        avgProductivity,
        logins: loginData.length,
        status: totalHoursWorked > 0 ? 'active' : 'inactive',
      },
    };
  } catch (error: any) {
    console.error('Error getting activity summary:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get employee productivity report
 */
export async function getProductivityReport(employeeId: string, startDate: string, endDate: string) {
  try {
    const db = await getMongoDb();
    const collection = db.collection('employee_work_data');

    const data = await collection
      .aggregate([
        {
          $match: {
            employeeId,
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: '$date',
            totalHoursWorked: { $sum: '$hoursWorked' },
            totalTasksCompleted: { $sum: '$tasksCompleted' },
            avgProductivity: { $avg: '$productivity' },
            workSessions: { $push: '$$ROOT' },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    return { success: true, data };
  } catch (error: any) {
    console.error('Error getting productivity report:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create necessary indexes for performance
 */
export async function ensureIndexes() {
  try {
    const db = await getMongoDb();

    // Employee work data indexes
    await db.collection('employee_work_data').createIndex({ employeeId: 1, date: -1 });
    await db.collection('employee_work_data').createIndex({ createdAt: -1 });

    // Login sessions indexes
    await db.collection('login_sessions').createIndex({ employeeId: 1, date: -1 });
    await db.collection('login_sessions').createIndex({ createdAt: -1 });

    // Employee activity indexes
    await db.collection('employee_activity').createIndex({ employeeId: 1, date: -1 });
    await db.collection('employee_activity').createIndex({ timestamp: -1 });

    // Task records indexes
    await db.collection('task_records').createIndex({ employeeId: 1, createdAt: -1 });
    await db.collection('task_records').createIndex({ status: 1 });

    console.log('Indexes created successfully');
  } catch (error: any) {
    console.error('Error creating indexes:', error);
  }
}

// Initialize indexes on module load
ensureIndexes().catch(console.error);
