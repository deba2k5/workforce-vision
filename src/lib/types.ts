// User/Employee Types
export interface EmployeeProfile {
  employeeId: string;
  fullName: string;
  email: string;
  mobile: string;
  department: string;
  employmentType: 'Temporary' | 'Permanent' | 'Contractor';
  position: string;
  manager: string;
  dateOfJoining: string;
  profilePhoto: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  employeeId: string;
  password: string;
  role: 'Employee' | 'Manager' | 'Admin' | 'SuperAdmin';
  lastLogin?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
}

// Work Tracking Types
export interface WorkSession {
  id: string;
  employeeId: string;
  clockInTime: Date;
  clockOutTime?: Date;
  workType: WorkType;
  breaks: Break[];
  location: LocationData;
  notes?: string;
  status: 'active' | 'paused' | 'completed';
}

export type WorkType = 
  | 'On-Site Field Work'
  | 'Remote Work / Work from Home'
  | 'Office Administration'
  | 'Client Meeting'
  | 'Training / Development'
  | 'Maintenance & Support'
  | 'Other';

export interface Break {
  id: string;
  startTime: Date;
  endTime?: Date;
  type: BreakType;
  status: 'active' | 'completed';
}

export type BreakType = 'Lunch Break' | 'Short Break' | 'Prayer Break' | 'Other';

// Location Types
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  inBoundary: boolean;
}

export interface GeofenceData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  enabled: boolean;
}

// Multimedia Types
export interface MediaFile {
  id: string;
  employeeId: string;
  workSessionId: string;
  fileName: string;
  fileType: 'image' | 'video';
  fileSize: number;
  fileUrl: string;
  uploadedAt: Date;
  metadata: {
    latitude?: number;
    longitude?: number;
    timestamp?: Date;
  };
}

// Report Types
export interface DailyReport {
  id: string;
  employeeId: string;
  date: Date;
  totalHoursWorked: number;
  totalBreakTime: number;
  workTypes: { type: WorkType; hours: number }[];
  notes: string;
  mediaFiles: MediaFile[];
  locationMap: LocationData[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
}

export interface AnalyticsData {
  employeeId?: string;
  date?: Date;
  totalHoursWorked: number;
  averageHoursPerDay: number;
  totalBreakTime: number;
  workTypeDistribution: { type: WorkType; hours: number; percentage: number }[];
  attendanceRate: number;
  productivityTrend: number[]; // percentage over weeks
}

// Authentication Types
export interface AuthRequest {
  employeeId: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  requiresTwoFactor?: boolean;
  message?: string;
}

export interface TwoFactorRequest {
  token: string;
  code: string;
}
