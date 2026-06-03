import { getMongoDb } from '../mongo.server';
import { ObjectId } from 'mongodb';

export interface EmployeeWorkData {
  _id?: ObjectId;
  employeeId: string;
  employeeName: string;
  email: string;
  date: string;
  startTime: string;
  endTime?: string;
  hoursWorked: number;
  tasksCompleted: number;
  productivity: number;
  status: 'active' | 'break' | 'offline';
  workType: string;
  description: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  screenShotUrl?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyAnalytics {
  _id?: ObjectId;
  employeeId: string;
  employeeName: string;
  date: string;
  totalHoursWorked: number;
  totalTasksCompleted: number;
  averageProductivity: number;
  breakTime: number;
  logins: number;
  status: 'active' | 'inactive';
  weeklyTrend?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRecord {
  _id?: ObjectId;
  employeeId: string;
  employeeName: string;
  date: string;
  loginTime: string;
  logoutTime?: string;
  duration?: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  createdAt: Date;
}

export interface TaskRecord {
  _id?: ObjectId;
  employeeId: string;
  taskId: string;
  taskTitle: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  completedDate?: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HeatmapData {
  _id?: ObjectId;
  employeeId: string;
  date: string;
  hour: string;
  productivity: number;
  tasksCount: number;
  activeTime: number;
  createdAt: Date;
}

// Save real-time employee work data
export async function saveEmployeeWorkData(data: Omit<EmployeeWorkData, '_id' | 'createdAt' | 'updatedAt'>) {
  const db = await getMongoDb();
  const collection = db.collection<EmployeeWorkData>('employee_work_data');

  const workData: EmployeeWorkData = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(workData);
  return result.insertedId;
}

// Update employee work data
export async function updateEmployeeWorkData(id: string, updates: Partial<EmployeeWorkData>) {
  const db = await getMongoDb();
  const collection = db.collection<EmployeeWorkData>('employee_work_data');

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

// Get employee work data for a specific date
export async function getEmployeeWorkDataByDate(employeeId: string, date: string) {
  const db = await getMongoDb();
  const collection = db.collection<EmployeeWorkData>('employee_work_data');

  return await collection
    .find({ employeeId, date })
    .sort({ createdAt: -1 })
    .toArray();
}

// Get employee work data for date range
export async function getEmployeeWorkDataByDateRange(employeeId: string, startDate: string, endDate: string) {
  const db = await getMongoDb();
  const collection = db.collection<EmployeeWorkData>('employee_work_data');

  return await collection
    .find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    })
    .sort({ date: -1, createdAt: -1 })
    .toArray();
}

// Save daily analytics
export async function saveDailyAnalytics(data: Omit<DailyAnalytics, '_id' | 'createdAt' | 'updatedAt'>) {
  const db = await getMongoDb();
  const collection = db.collection<DailyAnalytics>('daily_analytics');

  // Check if analytics for this day already exists
  const existing = await collection.findOne({ employeeId: data.employeeId, date: data.date });

  if (existing) {
    await collection.updateOne(
      { _id: existing._id },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      }
    );
    return existing._id;
  }

  const result = await collection.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return result.insertedId;
}

// Get daily analytics for employee
export async function getDailyAnalytics(employeeId: string, date: string) {
  const db = await getMongoDb();
  const collection = db.collection<DailyAnalytics>('daily_analytics');

  return await collection.findOne({ employeeId, date });
}

// Get analytics for date range
export async function getAnalyticsByDateRange(employeeId: string, startDate: string, endDate: string) {
  const db = await getMongoDb();
  const collection = db.collection<DailyAnalytics>('daily_analytics');

  return await collection
    .find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    })
    .sort({ date: 1 })
    .toArray();
}

// Save login record
export async function saveLoginRecord(data: Omit<LoginRecord, '_id' | 'createdAt'>) {
  const db = await getMongoDb();
  const collection = db.collection<LoginRecord>('login_records');

  const result = await collection.insertOne({
    ...data,
    createdAt: new Date(),
  });

  return result.insertedId;
}

// Update login record with logout time
export async function updateLoginLogout(loginId: string, logoutTime: string, duration: number) {
  const db = await getMongoDb();
  const collection = db.collection<LoginRecord>('login_records');

  const result = await collection.updateOne(
    { _id: new ObjectId(loginId) },
    {
      $set: {
        logoutTime,
        duration,
      },
    }
  );

  return result.modifiedCount > 0;
}

// Get login records for date range
export async function getLoginRecordsByDateRange(employeeId: string, startDate: string, endDate: string) {
  const db = await getMongoDb();
  const collection = db.collection<LoginRecord>('login_records');

  return await collection
    .find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    })
    .sort({ date: -1, loginTime: -1 })
    .toArray();
}

// Save task record
export async function saveTaskRecord(data: Omit<TaskRecord, '_id' | 'createdAt' | 'updatedAt'>) {
  const db = await getMongoDb();
  const collection = db.collection<TaskRecord>('task_records');

  const result = await collection.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return result.insertedId;
}

// Update task record
export async function updateTaskRecord(taskId: string, updates: Partial<TaskRecord>) {
  const db = await getMongoDb();
  const collection = db.collection<TaskRecord>('task_records');

  const result = await collection.updateOne(
    { taskId },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

// Get task records by employee and date
export async function getTaskRecordsByDateRange(employeeId: string, startDate: string, endDate: string) {
  const db = await getMongoDb();
  const collection = db.collection<TaskRecord>('task_records');

  return await collection
    .find({
      employeeId,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
    .sort({ createdAt: -1 })
    .toArray();
}

// Save heatmap data
export async function saveHeatmapData(data: Omit<HeatmapData, '_id' | 'createdAt'>) {
  const db = await getMongoDb();
  const collection = db.collection<HeatmapData>('heatmap_data');

  const result = await collection.insertOne({
    ...data,
    createdAt: new Date(),
  });

  return result.insertedId;
}

// Get heatmap data for date range
export async function getHeatmapDataByDateRange(employeeId: string, startDate: string, endDate: string) {
  const db = await getMongoDb();
  const collection = db.collection<HeatmapData>('heatmap_data');

  return await collection
    .find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    })
    .sort({ date: 1, hour: 1 })
    .toArray();
}

// Get employee productivity summary
export async function getProductivitySummary(employeeId: string, days: number = 30) {
  const db = await getMongoDb();
  const collection = db.collection<DailyAnalytics>('daily_analytics');

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await collection
    .aggregate([
      {
        $match: {
          employeeId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$employeeId',
          totalHours: { $sum: '$totalHoursWorked' },
          totalTasks: { $sum: '$totalTasksCompleted' },
          avgProductivity: { $avg: '$averageProductivity' },
          totalDays: { $sum: 1 },
        },
      },
    ])
    .toArray();
}

// Create indexes for better query performance
export async function createIndexes() {
  const db = await getMongoDb();

  // Employee work data indexes
  await db.collection('employee_work_data').createIndex({ employeeId: 1, date: -1 });
  await db.collection('employee_work_data').createIndex({ createdAt: -1 });

  // Daily analytics indexes
  await db.collection('daily_analytics').createIndex({ employeeId: 1, date: -1 });
  await db.collection('daily_analytics').createIndex({ createdAt: -1 });

  // Login records indexes
  await db.collection('login_records').createIndex({ employeeId: 1, date: -1 });
  await db.collection('login_records').createIndex({ createdAt: -1 });

  // Task records indexes
  await db.collection('task_records').createIndex({ employeeId: 1, createdAt: -1 });
  await db.collection('task_records').createIndex({ taskId: 1 });

  // Heatmap data indexes
  await db.collection('heatmap_data').createIndex({ employeeId: 1, date: -1 });
}
