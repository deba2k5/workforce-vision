import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { firestore } from "./firebase";

export const ADMIN_EMAIL = "admin@sinhas.ch";
export const TRACKED_EMPLOYEE_EMAIL = "employee1@sinhas.ch";
export const GEOFENCE_RADIUS_METERS = 100;

export type LiveStatus = "on-duty" | "on-break" | "off-duty" | "paused";

export interface LiveLocation {
  employeeEmail: string;
  employeeId: string;
  employeeName: string;
  adminEmail: string;
  department: string;
  status: LiveStatus;
  workType: string;
  hoursWorked: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  geofenceLatitude: number | null;
  geofenceLongitude: number | null;
  geofenceRadius: number;
  distanceFromGeofence: number | null;
  inBoundary: boolean;
  lastUpdated: Date | null;
}

export interface PendingReport {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  totalHours: number;
  workTypes: string[];
  attachments: number;
  submittedAt: string;
  status: "draft" | "submitted" | "approved" | "rejected";
}

const employeeDoc = () =>
  doc(firestore, "admins", ADMIN_EMAIL, "employees", TRACKED_EMPLOYEE_EMAIL);

const liveLocationDoc = () =>
  doc(firestore, "admins", ADMIN_EMAIL, "employees", TRACKED_EMPLOYEE_EMAIL, "live", "location");

const reportsCollection = () =>
  collection(firestore, "admins", ADMIN_EMAIL, "employees", TRACKED_EMPLOYEE_EMAIL, "reports");

const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof (value as Timestamp).toDate === "function") return (value as Timestamp).toDate();
  return null;
};

export const metersBetween = (
  first: { latitude: number; longitude: number },
  second: { latitude: number; longitude: number },
) => {
  const earthRadius = 6371000;
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRad(second.latitude - first.latitude);
  const dLon = toRad(second.longitude - first.longitude);
  const lat1 = toRad(first.latitude);
  const lat2 = toRad(second.latitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const canTrackCurrentUser = () =>
  localStorage.getItem("userEmail")?.toLowerCase() === TRACKED_EMPLOYEE_EMAIL;

export const updateLiveLocation = async (
  data: Omit<
    LiveLocation,
    "lastUpdated" | "adminEmail" | "employeeEmail" | "employeeId" | "employeeName" | "department"
  >,
) => {
  const { updateLiveLocationClient } = await import("./api/liveTracking.functions");
  await updateLiveLocationClient({ data: data as any });
};

export const subscribeToLiveEmployee = (
  onChange: (location: LiveLocation | null) => void,
): Unsubscribe =>
  onSnapshot(liveLocationDoc(), (snapshot) => {
    if (!snapshot.exists()) {
      onChange(null);
      return;
    }

    const data = snapshot.data();
    onChange({
      employeeEmail: data.employeeEmail ?? TRACKED_EMPLOYEE_EMAIL,
      employeeId: data.employeeId ?? "employee1",
      employeeName: data.employeeName ?? "Employee 1",
      adminEmail: data.adminEmail ?? ADMIN_EMAIL,
      department: data.department ?? "Operations",
      status: data.status ?? "off-duty",
      workType: data.workType ?? "Unknown",
      hoursWorked: Number(data.hoursWorked ?? 0),
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      accuracy: Number(data.accuracy ?? 0),
      geofenceLatitude: data.geofenceLatitude ?? null,
      geofenceLongitude: data.geofenceLongitude ?? null,
      geofenceRadius: Number(data.geofenceRadius ?? GEOFENCE_RADIUS_METERS),
      distanceFromGeofence: data.distanceFromGeofence ?? null,
      inBoundary: Boolean(data.inBoundary),
      lastUpdated: toDate(data.lastUpdated),
    });
  });

export const subscribeToPendingReports = (
  onChange: (reports: PendingReport[]) => void,
): Unsubscribe => {
  const reportsQuery = query(reportsCollection(), orderBy("submittedAt", "desc"));

  return onSnapshot(reportsQuery, (snapshot) => {
    onChange(
      snapshot.docs
        .map((reportDoc) => {
          const data = reportDoc.data();
          return {
            id: reportDoc.id,
            employeeId: data.employeeId ?? "employee1",
            employeeName: data.employeeName ?? "Employee 1",
            date: data.date ?? "",
            totalHours: Number(data.totalHours ?? 0),
            workTypes: Array.isArray(data.workTypes) ? data.workTypes : [],
            attachments: Number(data.attachments ?? 0),
            submittedAt: toDate(data.submittedAt)?.toLocaleString() ?? "",
            status: data.status ?? "submitted",
          };
        })
        .filter((report) => report.status === "submitted"),
    );
  });
};

export const updateReportStatus = async (
  reportId: string,
  status: "approved" | "rejected",
  rejectionReason?: string,
) => {
  await updateDoc(doc(reportsCollection(), reportId), {
    status,
    rejectionReason: rejectionReason ?? null,
    reviewedBy: ADMIN_EMAIL,
    reviewedAt: serverTimestamp(),
  });
};

// Seed test location data for admin testing
export const seedTestLocationData = async () => {
  const { seedLiveLocation } = await import("./api/liveTracking.functions");
  
  const testLocation = {
    status: "on-duty",
    workType: "On-Site Field Work",
    hoursWorked: 6.5,
    latitude: 47.3876,
    longitude: 8.5428,
    accuracy: 12,
    geofenceLatitude: 47.3869,
    geofenceLongitude: 8.5417,
    geofenceRadius: GEOFENCE_RADIUS_METERS,
    distanceFromGeofence: 45,
    inBoundary: true,
  };

  await seedLiveLocation({ data: testLocation });
};
