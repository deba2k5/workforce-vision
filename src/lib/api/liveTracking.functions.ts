import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getLiveEmployee, getPendingReports, updateLiveLocationMongo, updateReportStatusMongo, TRACKED_EMPLOYEE_EMAIL, ADMIN_EMAIL } from "./liveTracking.server";

export const fetchLiveEmployee = createServerFn({ method: "GET" }).handler(async () => {
  return await getLiveEmployee();
});

export const fetchPendingReports = createServerFn({ method: "GET" }).handler(async () => {
  return await getPendingReports();
});

export const updateLiveLocationClient = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      status: z.string(),
      workType: z.string(),
      hoursWorked: z.number(),
      latitude: z.number(),
      longitude: z.number(),
      accuracy: z.number(),
      geofenceLatitude: z.number().nullable(),
      geofenceLongitude: z.number().nullable(),
      geofenceRadius: z.number(),
      distanceFromGeofence: z.number().nullable(),
      inBoundary: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    await updateLiveLocationMongo(data as any);
    return { success: true };
  });

export const seedLiveLocation = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      status: z.string(),
      workType: z.string(),
      hoursWorked: z.number(),
      latitude: z.number(),
      longitude: z.number(),
      accuracy: z.number(),
      geofenceLatitude: z.number().nullable(),
      geofenceLongitude: z.number().nullable(),
      geofenceRadius: z.number(),
      distanceFromGeofence: z.number().nullable(),
      inBoundary: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    await updateLiveLocationMongo(data as any);
    return { success: true };
  });

export const updateReportStatusClient = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      reportId: z.string(),
      status: z.enum(["approved", "rejected"]),
      rejectionReason: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    await updateReportStatusMongo(data.reportId, data.status, data.rejectionReason);
    return { success: true };
  });
