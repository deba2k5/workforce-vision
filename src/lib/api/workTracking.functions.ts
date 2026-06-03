// Client-side functions to interact with work tracking APIs

export async function trackEmployeeWork(data: {
  employeeId: string;
  employeeName: string;
  email: string;
  date: string;
  startTime: string;
  hoursWorked: number;
  tasksCompleted: number;
  productivity: number;
  status: 'active' | 'break' | 'offline';
  workType: string;
  description: string;
  location?: { latitude: number; longitude: number; address?: string };
}) {
  try {
    const response = await fetch('/api/work-tracking/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error tracking work:', error);
    throw error;
  }
}

export async function getEmployeeWorkData(employeeId: string, date: string) {
  try {
    const response = await fetch(`/api/work-tracking/get?employeeId=${employeeId}&date=${date}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching work data:', error);
    throw error;
  }
}

export async function getEmployeeWorkDataRange(employeeId: string, startDate: string, endDate: string) {
  try {
    const response = await fetch(
      `/api/work-tracking/range?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching work data range:', error);
    throw error;
  }
}

export async function saveLoginRecord(data: {
  employeeId: string;
  employeeName: string;
  date: string;
  loginTime: string;
  location?: { latitude: number; longitude: number; address?: string };
}) {
  try {
    const response = await fetch('/api/work-tracking/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving login:', error);
    throw error;
  }
}

export async function saveLogoutRecord(loginId: string, logoutTime: string, duration: number) {
  try {
    const response = await fetch(`/api/work-tracking/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId, logoutTime, duration }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving logout:', error);
    throw error;
  }
}

export async function saveTask(data: {
  employeeId: string;
  taskId: string;
  taskTitle: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  description: string;
}) {
  try {
    const response = await fetch('/api/work-tracking/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving task:', error);
    throw error;
  }
}

export async function updateTask(taskId: string, updates: Partial<any>) {
  try {
    const response = await fetch(`/api/work-tracking/task/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function getTaskRecords(employeeId: string, startDate: string, endDate: string) {
  try {
    const response = await fetch(
      `/api/work-tracking/tasks?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export async function getLoginRecords(employeeId: string, startDate: string, endDate: string) {
  try {
    const response = await fetch(
      `/api/work-tracking/logins?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching logins:', error);
    throw error;
  }
}

export async function saveDailyAnalytics(data: {
  employeeId: string;
  employeeName: string;
  date: string;
  totalHoursWorked: number;
  totalTasksCompleted: number;
  averageProductivity: number;
  breakTime: number;
  logins: number;
  status: 'active' | 'inactive';
}) {
  try {
    const response = await fetch('/api/work-tracking/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving analytics:', error);
    throw error;
  }
}

export async function getAnalyticsRange(employeeId: string, startDate: string, endDate: string) {
  try {
    const response = await fetch(
      `/api/work-tracking/analytics-range?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

export async function getProductivitySummary(employeeId: string, days: number = 30) {
  try {
    const response = await fetch(`/api/work-tracking/summary?employeeId=${employeeId}&days=${days}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error;
  }
}

export async function saveHeatmapData(data: {
  employeeId: string;
  date: string;
  hour: string;
  productivity: number;
  tasksCount: number;
  activeTime: number;
}) {
  try {
    const response = await fetch('/api/work-tracking/heatmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving heatmap data:', error);
    throw error;
  }
}

export async function getHeatmapData(employeeId: string, startDate: string, endDate: string) {
  try {
    const response = await fetch(
      `/api/work-tracking/heatmap-range?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    throw error;
  }
}
