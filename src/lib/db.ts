import type { EmployeeProfile, WorkSession, DailyReport, LocationData } from './types';

// In-memory database for development (replace with actual DB in production)
export const db = {
  employees: new Map<string, EmployeeProfile>(),
  workSessions: new Map<string, WorkSession[]>(),
  dailyReports: new Map<string, DailyReport[]>(),
  locationData: new Map<string, LocationData[]>(),
};

// Initialize with sample data
export function initializeDB() {
  const sampleEmployee: EmployeeProfile = {
    employeeId: 'EMP001',
    fullName: 'Ana Kowalski',
    email: 'ana.kowalski@company.com',
    mobile: '+1234567890',
    department: 'Operations',
    employmentType: 'Permanent',
    position: 'Operations Lead',
    manager: 'John Smith',
    dateOfJoining: '2023-01-15',
    profilePhoto: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  db.employees.set('EMP001', sampleEmployee);
}

export async function getEmployeeById(id: string): Promise<EmployeeProfile | null> {
  return db.employees.get(id) || null;
}

export async function getAllEmployees(): Promise<EmployeeProfile[]> {
  return Array.from(db.employees.values());
}

export async function updateEmployee(id: string, data: Partial<EmployeeProfile>): Promise<EmployeeProfile | null> {
  const employee = db.employees.get(id);
  if (!employee) return null;
  
  const updated = { ...employee, ...data, updatedAt: new Date() };
  db.employees.set(id, updated);
  return updated;
}

export async function createWorkSession(employeeId: string, session: WorkSession): Promise<WorkSession> {
  if (!db.workSessions.has(employeeId)) {
    db.workSessions.set(employeeId, []);
  }
  
  const sessions = db.workSessions.get(employeeId)!;
  sessions.push(session);
  return session;
}

export async function getWorkSessions(employeeId: string, date: Date): Promise<WorkSession[]> {
  const sessions = db.workSessions.get(employeeId) || [];
  return sessions.filter(s => 
    new Date(s.clockInTime).toDateString() === date.toDateString()
  );
}

export async function saveDailyReport(report: DailyReport): Promise<DailyReport> {
  if (!db.dailyReports.has(report.employeeId)) {
    db.dailyReports.set(report.employeeId, []);
  }
  
  const reports = db.dailyReports.get(report.employeeId)!;
  reports.push(report);
  return report;
}

export async function saveLocationData(employeeId: string, location: LocationData): Promise<LocationData> {
  if (!db.locationData.has(employeeId)) {
    db.locationData.set(employeeId, []);
  }
  
  const locations = db.locationData.get(employeeId)!;
  locations.push(location);
  return location;
}
