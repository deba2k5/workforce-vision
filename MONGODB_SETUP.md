# MongoDB Real-Time Employee Work Tracking

## Overview
This system provides real-time tracking and storage of employee work activities in MongoDB, including:
- Work sessions and hours tracking
- Task management and completion
- Login/logout records
- Daily analytics and productivity metrics
- Performance heatmaps
- Activity reports with PDF generation

## Database Schema

### Collections

#### 1. `employee_work_data`
Stores detailed work session information for each employee.

```javascript
{
  _id: ObjectId,
  employeeId: String,        // Unique employee identifier
  employeeName: String,
  email: String,
  date: String,              // YYYY-MM-DD format
  startTime: String,         // HH:MM format
  endTime: String,
  hoursWorked: Number,
  tasksCompleted: Number,
  productivity: Number,      // 0-100%
  status: String,            // 'active', 'break', 'offline'
  workType: String,          // Type of work being done
  description: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  screenShotUrl: String,     // Optional screenshot
  attachments: [String],     // File URLs
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. `login_sessions`
Tracks employee login/logout times and session duration.

```javascript
{
  _id: ObjectId,
  employeeId: String,
  employeeName: String,
  date: String,              // YYYY-MM-DD format
  loginTime: String,         // HH:MM AM/PM
  logoutTime: String,
  duration: Number,          // Minutes worked
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  status: String,            // 'active', 'completed'
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. `daily_analytics`
Daily summary of employee activity and performance.

```javascript
{
  _id: ObjectId,
  employeeId: String,
  employeeName: String,
  date: String,              // YYYY-MM-DD format
  totalHoursWorked: Number,
  totalTasksCompleted: Number,
  averageProductivity: Number,
  breakTime: Number,         // Minutes
  logins: Number,
  status: String,            // 'active', 'inactive'
  weeklyTrend: [Number],     // Productivity trend
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. `task_records`
Stores individual task details and status.

```javascript
{
  _id: ObjectId,
  employeeId: String,
  taskId: String,
  taskTitle: String,
  priority: String,          // 'high', 'medium', 'low'
  status: String,            // 'pending', 'in-progress', 'completed'
  dueDate: String,           // YYYY-MM-DD
  completedDate: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. `heatmap_data`
Tracks productivity by hour for heatmap visualization.

```javascript
{
  _id: ObjectId,
  employeeId: String,
  date: String,              // YYYY-MM-DD
  hour: String,              // HH:00 format
  productivity: Number,      // 0-100
  tasksCount: Number,
  activeTime: Number,        // Minutes
  createdAt: Date
}
```

#### 6. `employee_activity`
Real-time activity tracking.

```javascript
{
  _id: ObjectId,
  employeeId: String,
  employeeName: String,
  email: String,
  date: String,
  timestamp: String,         // ISO format
  status: String,            // 'active', 'break', 'offline'
  tasksCompleted: Number,
  productivity: Number,
  workType: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Functions

### Server-Side Functions (`src/lib/api/workTracking.server.ts`)

#### Work Data Management
```typescript
// Save work session
saveEmployeeWorkData(data: EmployeeWorkData): Promise<ObjectId>

// Get work data by date
getEmployeeWorkDataByDate(employeeId: string, date: string): Promise<EmployeeWorkData[]>

// Get work data for date range
getEmployeeWorkDataByDateRange(employeeId: string, startDate: string, endDate: string): Promise<EmployeeWorkData[]>

// Update work session
updateEmployeeWorkData(id: string, updates: Partial<EmployeeWorkData>): Promise<boolean>
```

#### Analytics Functions
```typescript
// Save daily analytics
saveDailyAnalytics(data: DailyAnalytics): Promise<ObjectId>

// Get analytics for specific day
getDailyAnalytics(employeeId: string, date: string): Promise<DailyAnalytics | null>

// Get analytics for date range
getAnalyticsByDateRange(employeeId: string, startDate: string, endDate: string): Promise<DailyAnalytics[]>

// Get productivity summary
getProductivitySummary(employeeId: string, days: number): Promise<any[]>
```

#### Login/Logout Tracking
```typescript
// Record login
saveLoginRecord(data: LoginRecord): Promise<ObjectId>

// Record logout
updateLoginLogout(loginId: string, logoutTime: string, duration: number): Promise<boolean>

// Get login records
getLoginRecordsByDateRange(employeeId: string, startDate: string, endDate: string): Promise<LoginRecord[]>
```

#### Task Management
```typescript
// Save task
saveTaskRecord(data: TaskRecord): Promise<ObjectId>

// Update task
updateTaskRecord(taskId: string, updates: Partial<TaskRecord>): Promise<boolean>

// Get tasks
getTaskRecordsByDateRange(employeeId: string, startDate: string, endDate: string): Promise<TaskRecord[]>
```

#### Heatmap Data
```typescript
// Save hourly productivity data
saveHeatmapData(data: HeatmapData): Promise<ObjectId>

// Get heatmap data
getHeatmapDataByDateRange(employeeId: string, startDate: string, endDate: string): Promise<HeatmapData[]>
```

### Client-Side Functions (`src/lib/api/workTracking.functions.ts`)

All client functions return promises and handle error management:

```typescript
// Track work
trackEmployeeWork(data): Promise<Response>

// Get work data
getEmployeeWorkData(employeeId, date): Promise<Response>
getEmployeeWorkDataRange(employeeId, startDate, endDate): Promise<Response>

// Login/Logout
saveLoginRecord(data): Promise<Response>
saveLogoutRecord(loginId, logoutTime, duration): Promise<Response>

// Tasks
saveTask(data): Promise<Response>
updateTask(taskId, updates): Promise<Response>
getTaskRecords(employeeId, startDate, endDate): Promise<Response>

// Analytics
saveDailyAnalytics(data): Promise<Response>
getAnalyticsRange(employeeId, startDate, endDate): Promise<Response>
getProductivitySummary(employeeId, days): Promise<Response>
```

## Custom Hooks

### `useMongoPersist<T>`
Generic hook for persisting data to MongoDB.

```typescript
const {
  data,
  setData,
  saveItem,
  updateItem,
  deleteItem,
  fetchData,
  loading,
  error,
} = useMongoPersist('collectionName', initialData, employeeId);
```

### `useActivityTracking`
Real-time activity tracking hook.

```typescript
const {
  currentActivity,
  trackActivity,
  sessionStartTime,
} = useActivityTracking(employeeId, employeeName, email);
```

### `useLoginTracking`
Login/logout session tracking hook.

```typescript
const {
  loginTime,
  sessionId,
  recordLogin,
  recordLogout,
} = useLoginTracking(employeeId, employeeName);
```

## Integration Examples

### Saving a Task
```typescript
import { saveTask } from '@/lib/api/workTracking.functions';

const result = await saveTask({
  employeeId: 'EMP001',
  taskId: 'TASK001',
  taskTitle: 'Complete report',
  priority: 'high',
  status: 'in-progress',
  dueDate: '2025-03-15',
  description: 'Quarterly performance report'
});
```

### Tracking Work Session
```typescript
import { trackEmployeeWork } from '@/lib/api/workTracking.functions';

const result = await trackEmployeeWork({
  employeeId: 'EMP001',
  employeeName: 'Ana Kowalski',
  email: 'ana@company.com',
  date: '2025-03-10',
  startTime: '09:00',
  hoursWorked: 8.5,
  tasksCompleted: 5,
  productivity: 85,
  status: 'active',
  workType: 'Field Work',
  description: 'Site inspection and documentation'
});
```

### Recording Login/Logout
```typescript
import { saveLoginRecord, saveLogoutRecord } from '@/lib/api/workTracking.functions';

// On login
const loginResult = await saveLoginRecord({
  employeeId: 'EMP001',
  employeeName: 'Ana Kowalski',
  date: '2025-03-10',
  loginTime: '09:00 AM',
  location: { latitude: 40.7128, longitude: -74.0060 }
});

// On logout
const logoutResult = await saveLogoutRecord(
  loginResult.id,
  '05:30 PM',
  480 // minutes
);
```

### Getting Analytics
```typescript
import { getAnalyticsRange } from '@/lib/api/workTracking.functions';

const analytics = await getAnalyticsRange('EMP001', '2025-03-01', '2025-03-10');
```

## Database Indexes

The system automatically creates the following indexes for performance:

```javascript
// Employee work data
db.employee_work_data.createIndex({ employeeId: 1, date: -1 })
db.employee_work_data.createIndex({ createdAt: -1 })

// Daily analytics
db.daily_analytics.createIndex({ employeeId: 1, date: -1 })
db.daily_analytics.createIndex({ createdAt: -1 })

// Login records
db.login_records.createIndex({ employeeId: 1, date: -1 })
db.login_records.createIndex({ createdAt: -1 })

// Task records
db.task_records.createIndex({ employeeId: 1, createdAt: -1 })
db.task_records.createIndex({ taskId: 1 })

// Heatmap data
db.heatmap_data.createIndex({ employeeId: 1, date: -1 })
```

## Environment Configuration

Required MongoDB URI in `.env`:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
```

## Features

✅ Real-time employee work tracking
✅ Automatic analytics generation
✅ Login/logout session tracking
✅ Task management with status tracking
✅ Hourly productivity heatmaps
✅ PDF report generation
✅ Comprehensive activity reports
✅ Productivity trends and summaries
✅ Location-based tracking support
✅ Automatic index creation for performance

## Performance Considerations

- Queries are optimized with indexed fields
- Data is grouped by date for faster retrieval
- Aggregation pipelines for summary calculations
- Real-time updates with MongoDB
- Batch processing for analytics

## Security

- All operations validate employee ownership
- MongoDB connection uses environment variables
- No sensitive data exposed in logs
- Error handling with safe messaging
