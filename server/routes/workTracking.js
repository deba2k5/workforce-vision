import express from 'express';
import { getDB } from '../config/db.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Save or update work tracking data
router.post('/save', asyncHandler(async (req, res) => {
  const { employeeId, date, hoursWorked, tasksCompleted, productivity } = req.body;

  if (!employeeId || !date) {
    return res.status(400).json({ error: 'employeeId and date required' });
  }

  const db = getDB();
  const workDataCollection = db.collection('employee_work_data');

  const result = await workDataCollection.updateOne(
    { employeeId, date },
    {
      $set: {
        employeeId,
        date,
        hoursWorked: hoursWorked || 0,
        tasksCompleted: tasksCompleted || 0,
        productivity: productivity || 0,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  res.json({
    success: true,
    message: 'Work data saved',
    result,
  });
}));

// Get work data for date range
router.get('/range', asyncHandler(async (req, res) => {
  const { employeeId, startDate, endDate } = req.query;

  if (!employeeId || !startDate || !endDate) {
    return res.status(400).json({ error: 'employeeId, startDate, and endDate required' });
  }

  const db = getDB();
  const workDataCollection = db.collection('employee_work_data');

  const data = await workDataCollection
    .find({
      employeeId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
    .toArray();

  res.json({
    success: true,
    data,
  });
}));

// Save task record
router.post('/task', asyncHandler(async (req, res) => {
  const { employeeId, taskId, title, priority, status, dueDate, completedDate } = req.body;

  if (!employeeId || !taskId) {
    return res.status(400).json({ error: 'employeeId and taskId required' });
  }

  const db = getDB();
  const taskCollection = db.collection('task_records');

  const result = await taskCollection.updateOne(
    { employeeId, taskId },
    {
      $set: {
        employeeId,
        taskId,
        title,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        completedDate: completedDate ? new Date(completedDate) : null,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  res.json({
    success: true,
    message: 'Task saved',
    result,
  });
}));

// Get tasks for employee
router.get('/tasks', asyncHandler(async (req, res) => {
  const { employeeId, status } = req.query;

  if (!employeeId) {
    return res.status(400).json({ error: 'employeeId required' });
  }

  const db = getDB();
  const taskCollection = db.collection('task_records');

  const query = { employeeId };
  if (status) {
    query.status = status;
  }

  const tasks = await taskCollection.find(query).toArray();

  res.json({
    success: true,
    tasks,
  });
}));

// Save login record
router.post('/login', asyncHandler(async (req, res) => {
  const { employeeId, loginTime, location } = req.body;

  if (!employeeId || !loginTime) {
    return res.status(400).json({ error: 'employeeId and loginTime required' });
  }

  const db = getDB();
  const loginCollection = db.collection('login_sessions');

  const result = await loginCollection.insertOne({
    employeeId,
    loginTime: new Date(loginTime),
    logoutTime: null,
    location: location || null,
    duration: 0,
    createdAt: new Date(),
  });

  res.json({
    success: true,
    message: 'Login recorded',
    sessionId: result.insertedId,
  });
}));

// Record logout
router.post('/logout', asyncHandler(async (req, res) => {
  const { sessionId, logoutTime } = req.body;

  if (!sessionId || !logoutTime) {
    return res.status(400).json({ error: 'sessionId and logoutTime required' });
  }

  const db = getDB();
  const loginCollection = db.collection('login_sessions');

  const session = await loginCollection.findOne({ _id: new ObjectId(sessionId) });

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const duration = new Date(logoutTime) - session.loginTime;

  const result = await loginCollection.updateOne(
    { _id: new ObjectId(sessionId) },
    {
      $set: {
        logoutTime: new Date(logoutTime),
        duration: Math.round(duration / 1000 / 60), // in minutes
        updatedAt: new Date(),
      },
    }
  );

  res.json({
    success: true,
    message: 'Logout recorded',
    result,
  });
}));

// Get login records for date range
router.get('/logins', asyncHandler(async (req, res) => {
  const { employeeId, startDate, endDate } = req.query;

  if (!employeeId || !startDate || !endDate) {
    return res.status(400).json({ error: 'employeeId, startDate, and endDate required' });
  }

  const db = getDB();
  const loginCollection = db.collection('login_sessions');

  const logins = await loginCollection
    .find({
      employeeId,
      loginTime: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
    .toArray();

  res.json({
    success: true,
    logins,
  });
}));

// Save heatmap data
router.post('/heatmap', asyncHandler(async (req, res) => {
  const { employeeId, date, hour, productivity, tasksCount } = req.body;

  if (!employeeId || !date || hour === undefined) {
    return res.status(400).json({ error: 'employeeId, date, and hour required' });
  }

  const db = getDB();
  const heatmapCollection = db.collection('heatmap_data');

  const result = await heatmapCollection.updateOne(
    { employeeId, date, hour },
    {
      $set: {
        employeeId,
        date,
        hour,
        productivity: productivity || 0,
        tasksCount: tasksCount || 0,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  res.json({
    success: true,
    message: 'Heatmap data saved',
    result,
  });
}));

// Get productivity summary
router.get('/productivity-summary', asyncHandler(async (req, res) => {
  const { employeeId, startDate, endDate } = req.query;

  if (!employeeId || !startDate || !endDate) {
    return res.status(400).json({ error: 'employeeId, startDate, and endDate required' });
  }

  const db = getDB();
  const workDataCollection = db.collection('employee_work_data');

  const result = await workDataCollection.aggregate([
    {
      $match: {
        employeeId,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalHours: { $sum: '$hoursWorked' },
        totalTasks: { $sum: '$tasksCompleted' },
        avgProductivity: { $avg: '$productivity' },
        workDays: { $sum: 1 },
      },
    },
  ]).toArray();

  const summary = result[0] || {
    totalHours: 0,
    totalTasks: 0,
    avgProductivity: 0,
    workDays: 0,
  };

  res.json({
    success: true,
    summary,
  });
}));

export default router;
