import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const locationSchema = z
  .object({
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number().nullable(),
    distanceFromGeofence: z.number().nullable(),
    inBoundary: z.boolean(),
  })
  .nullable();

const clockEventSchema = z.object({
  eventType: z.enum([
    "clock-in",
    "clock-out",
    "pause",
    "resume",
    "break-start",
    "break-end",
    "heartbeat",
  ]),
  sessionId: z.string().min(1),
  employeeEmail: z.literal("employee1@sinhas.ch"),
  adminEmail: z.literal("admin@sinhas.ch"),
  workType: z.string().min(1),
  status: z.enum(["on-duty", "on-break", "off-duty", "paused"]),
  elapsedSeconds: z.number().int().nonnegative(),
  breakSeconds: z.number().int().nonnegative(),
  notes: z.string(),
  location: locationSchema,
});

export const saveEmployeeClockEvent = createServerFn({ method: "POST" })
  .inputValidator(clockEventSchema)
  .handler(async ({ data }) => {
    const { getMongoDb } = await import("../mongo.server");
    const db = await getMongoDb();
    const eventTime = new Date();

    const eventDocument = {
      ...data,
      employeeId: "employee1",
      employeeName: "Employee 1",
      createdAt: eventTime,
    };

    await db.collection("employeeClockEvents").insertOne(eventDocument);

    await db.collection("employeeTimeClock").updateOne(
      {
        employeeEmail: data.employeeEmail,
        sessionId: data.sessionId,
      },
      {
        $set: {
          employeeEmail: data.employeeEmail,
          employeeId: "employee1",
          employeeName: "Employee 1",
          adminEmail: data.adminEmail,
          sessionId: data.sessionId,
          workType: data.workType,
          status: data.status,
          elapsedSeconds: data.elapsedSeconds,
          breakSeconds: data.breakSeconds,
          notes: data.notes,
          location: data.location,
          lastEventType: data.eventType,
          updatedAt: eventTime,
          ...(data.eventType === "clock-out" ? { clockOutAt: eventTime } : {}),
          ...(data.eventType === "heartbeat" ? { lastHeartbeatAt: eventTime } : {}),
        },
        $setOnInsert: {
          clockInAt: eventTime,
          createdAt: eventTime,
        },
      },
      { upsert: true },
    );

    return {
      ok: true,
      savedAt: eventTime.toISOString(),
    };
  });
