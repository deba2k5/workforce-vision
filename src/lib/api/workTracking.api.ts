import { defineEventHandler, readBody, getQuery } from 'h3';
import {
  saveEmployeeWorkData,
  updateEmployeeWorkData,
  getEmployeeWorkDataByDate,
  getEmployeeWorkDataByDateRange,
  saveDailyAnalytics,
  getDailyAnalytics,
  getAnalyticsByDateRange,
  saveLoginRecord,
  updateLoginLogout,
  getLoginRecordsByDateRange,
  saveTaskRecord,
  updateTaskRecord,
  getTaskRecordsByDateRange,
  saveHeatmapData,
  getHeatmapDataByDateRange,
  getProductivitySummary,
  createIndexes,
} from '../../../lib/api/workTracking.server';

// Initialize indexes on server start
createIndexes().catch(console.error);

// Save work tracking data
export const saveWorkTracking = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const result = await saveEmployeeWorkData(body);
    return { success: true, id: result };
  } catch (error: any) {
    console.error('Error saving work tracking:', error);
    return { success: false, error: error.message };
  }
});

// Get work data for specific date
export const getWorkData = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { employeeId, date } = query;

    if (!employeeId || !date) {
      return { success: false, error: 'Missing employeeId or date' };
    }

    const data = await getEmployeeWorkDataByDate(employeeId as string, date as string);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error getting work data:', error);
    return { success: false, error: error.message };
  }
});

// Get work data for date range
export const getWorkDataRange = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { employeeId, startDate, endDate } = query;

    if (!employeeId || !startDate || !endDate) {
      return { success: false, error: 'Missing required parameters' };
    }

    const data = await getEmployeeWorkDataByDateRange(
      employeeId as string,
      startDate as string,
      endDate as string
    );
    return { success: true, data };
  } catch (error: any) {
    console.error('Error getting work data range:', error);
    return { success: false, error: error.message };
  }
});

// Save login record
export const saveLogin = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const result = await saveLoginRecord(body);
    return { success: true, id: result };
  } catch (error: any) {
    console.error('Error saving login:', error);
    return { success: false, error: error.message };
  }
});

// Update logout record
export const saveLogout = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { loginId, logoutTime, duration } = body;

    const result = await updateLoginLogout(loginId, logoutTime, duration);
    return { success: result };
  } catch (error: any) {
    console.error('Error saving logout:', error);
    return { success: false, error: error.message };
  }
});

// Get login records
export const getLogins = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { employeeId, startDate, endDate } = query;

    if (!employeeId || !startDate || !endDate) {
      return { success: false, error: 'Missing required parameters' };
    }

    const data = await getLoginRecordsByDateRange(
      employeeId as string,
      startDate as string,
      endDate as string
    );
    return { success: true, data };
  } catch (error: any) {
    console.error('Error getting login records:', error);
    return { success: false, error: error.message };
  }
});

// Save task record
export const saveTask = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const result = await saveTaskRecord(body);
    return { success: true, id: result };
  } catch (error: any) {
    console.error('Error saving task:', error);
    return { success: false, error: error.message };
  }
});

// Update task record
export const updateTask = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { taskId, ...updates } = body;

    const result = await updateTaskRecord(taskId, updates);
    return { success: result };
  } catch (error: any) {
    console.error('Error updating task:', error);
    return { success: false, error: error.message };
  }
});

// Get task records
export const getTasks = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { employeeId, startDate, endDate } = query;

    if (!employeeId || !startDate || !endDate) {
      return { success: false, error: 'Missing required parameters' };
    }

    const data = await getTaskRecordsByDateRange(
      employeeId as string,
      startDate as string,
      endDate as string
    );
    return { success: true, data };
  } catch (error: any) {
    console.error('Error getting tasks:', error);
    return { success: false, error: error.message };
  }
});

// Save daily analytics
export const saveAnalytics = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const result = await saveDailyAnalytics(body);
    return { success: true, id: result };
  } catch (error: any) {
    console.error('Error saving analytics:', error);
    return { success: false, error: error.message };
  }
});

// Get analytics for date range
export const getAnalyticsRange = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { employeeId, startDate, endDate } = query;

    if (!employeeId || !startDate || !endDate) {
      return { success: false, error: 'Missing required parameters' };
    }

    const data = await getAnalyticsByDateRange(
      employeeId as string,
      startDate as string,
      endDate as string
    );
    return { success: true, data };
  } catch (error: any) {
    console.error('Error getting analytics:', error);
    return { success: false, error: error.message };
  }
});

// Get productivity summary
export const getSummary = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { employeeId, days } = query;

    if (!employeeId) {
      return { success: false, error: 'Missing employeeId' };
    }

    const data = await getProductivitySummary(employeeId as string, parseInt(days as string) || 30);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error getting summary:', error);
    return { success: false, error: error.message };
  }
});

// Save heatmap data
export const saveHeatmap = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const result = await saveHeatmapData(body);
    return { success: true, id: result };
  } catch (error: any) {
    console.error('Error saving heatmap:', error);
    return { success: false, error: error.message };
  }
});

// Get heatmap data
export const getHeatmap = defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { employeeId, startDate, endDate } = query;

    if (!employeeId || !startDate || !endDate) {
      return { success: false, error: 'Missing required parameters' };
    }

    const data = await getHeatmapDataByDateRange(
      employeeId as string,
      startDate as string,
      endDate as string
    );
    return { success: true, data };
  } catch (error: any) {
    console.error('Error getting heatmap:', error);
    return { success: false, error: error.message };
  }
});
