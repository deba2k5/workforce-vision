import { getMongoDb } from "../mongo.server";
import type { LiveLocation } from "../liveTracking";

export const TRACKED_EMPLOYEE_EMAIL = "employee1@sinhas.ch";
export const ADMIN_EMAIL = "admin@sinhas.ch";

export async function updateLiveLocationMongo(
  data: Omit<
    LiveLocation,
    "lastUpdated" | "adminEmail" | "employeeEmail" | "employeeId" | "employeeName" | "department"
  >,
) {
  const db = await getMongoDb();
  const collection = db.collection("liveLocations");

  await collection.updateOne(
    { employeeEmail: TRACKED_EMPLOYEE_EMAIL },
    {
      $set: {
        employeeEmail: TRACKED_EMPLOYEE_EMAIL,
        employeeId: "employee1",
        employeeName: "Employee 1",
        adminEmail: ADMIN_EMAIL,
        department: "Operations",
        ...data,
        lastUpdated: new Date(),
      },
    },
    { upsert: true },
  );
}

export async function getLiveEmployee(): Promise<LiveLocation | null> {
  const db = await getMongoDb();
  const collection = db.collection("liveLocations");

  const doc = await collection.findOne({
    employeeEmail: TRACKED_EMPLOYEE_EMAIL,
  });

  if (!doc) return null;

  return {
    employeeEmail: doc.employeeEmail || TRACKED_EMPLOYEE_EMAIL,
    employeeId: doc.employeeId || "employee1",
    employeeName: doc.employeeName || "Employee 1",
    adminEmail: doc.adminEmail || ADMIN_EMAIL,
    department: doc.department || "Operations",
    status: doc.status || "off-duty",
    workType: doc.workType || "Unknown",
    hoursWorked: Number(doc.hoursWorked || 0),
    latitude: Number(doc.latitude),
    longitude: Number(doc.longitude),
    accuracy: Number(doc.accuracy || 0),
    geofenceLatitude: doc.geofenceLatitude || null,
    geofenceLongitude: doc.geofenceLongitude || null,
    geofenceRadius: Number(doc.geofenceRadius || 100),
    distanceFromGeofence: doc.distanceFromGeofence || null,
    inBoundary: Boolean(doc.inBoundary),
    lastUpdated: doc.lastUpdated ? new Date(doc.lastUpdated) : null,
  };
}

export async function getPendingReports() {
  const db = await getMongoDb();
  const collection = db.collection("reports");

  const reports = await collection
    .find({
      employeeEmail: TRACKED_EMPLOYEE_EMAIL,
      status: "submitted",
    })
    .sort({ submittedAt: -1 })
    .toArray();

  return reports.map((report) => ({
    id: report._id.toString(),
    employeeId: report.employeeId || "employee1",
    employeeName: report.employeeName || "Employee 1",
    date: report.date || "",
    totalHours: Number(report.totalHours || 0),
    workTypes: Array.isArray(report.workTypes) ? report.workTypes : [],
    attachments: Number(report.attachments || 0),
    submittedAt: report.submittedAt?.toLocaleString?.() || "",
    status: report.status || "submitted",
  }));
}

export async function updateReportStatusMongo(
  reportId: string,
  status: "approved" | "rejected",
  rejectionReason?: string,
) {
  const db = await getMongoDb();
  const collection = db.collection("reports");
  const { ObjectId } = await import("mongodb");

  await collection.updateOne(
    { _id: new ObjectId(reportId) },
    {
      $set: {
        status,
        rejectionReason: rejectionReason || null,
        reviewedBy: ADMIN_EMAIL,
        reviewedAt: new Date(),
      },
    },
  );
}
