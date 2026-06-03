import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { AlertCircle, Clock, LogOut, MapPin, Pause, Play } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { saveEmployeeClockEvent } from "../../lib/api/clock.functions";
import {
  canTrackCurrentUser,
  GEOFENCE_RADIUS_METERS,
  metersBetween,
  updateLiveLocation,
  type LiveStatus,
} from "../../lib/liveTracking";

type Coordinate = { latitude: number; longitude: number };

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
});

function EmployeeLocationMap({
  location,
  accuracy,
  geofenceCenter,
  inBoundary,
}: {
  location: Coordinate;
  accuracy: number | null;
  geofenceCenter: Coordinate | null;
  inBoundary: boolean;
}) {
  const mapPosition: [number, number] = [location.latitude, location.longitude];

  return (
    <div className="h-[320px] overflow-hidden rounded-lg border border-border">
      <MapContainer center={mapPosition} zoom={17} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <EmployeeMapRecenter position={mapPosition} />
        {geofenceCenter && (
          <Circle
            center={[geofenceCenter.latitude, geofenceCenter.longitude]}
            radius={GEOFENCE_RADIUS_METERS}
            pathOptions={{
              color: inBoundary ? "#16a34a" : "#dc2626",
              fillColor: inBoundary ? "#22c55e" : "#ef4444",
              fillOpacity: 0.12,
            }}
          />
        )}
        {accuracy && (
          <Circle
            center={mapPosition}
            radius={accuracy}
            pathOptions={{
              color: "#2563eb",
              fillColor: "#3b82f6",
              fillOpacity: 0.08,
            }}
          />
        )}
        <Marker position={mapPosition}>
          <Popup>
            <div className="space-y-1 text-sm">
              <strong>Your live location</strong>
              <div>Lat: {location.latitude.toFixed(6)}</div>
              <div>Lng: {location.longitude.toFixed(6)}</div>
              {accuracy && <div>Accuracy: {Math.round(accuracy)}m</div>}
              <div>
                Geofence: {geofenceCenter ? (inBoundary ? "Inside" : "Outside") : "Not started"}
              </div>
            </div>
          </Popup>
        </Marker>
        <CircleMarker
          center={mapPosition}
          radius={9}
          pathOptions={{
            color: inBoundary ? "#16a34a" : "#dc2626",
            fillColor: inBoundary ? "#22c55e" : "#ef4444",
            fillOpacity: 0.35,
          }}
        />
      </MapContainer>
    </div>
  );
}

function EmployeeMapRecenter({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, Math.max(map.getZoom(), 17));
  }, [map, position]);

  return null;
}

export function WorkTracking() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [workType, setWorkType] = useState("On-Site Field Work");
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [geofenceCenter, setGeofenceCenter] = useState<Coordinate | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [breakTime, setBreakTime] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [mongoError, setMongoError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const trackingAllowed = canTrackCurrentUser();
  const statusRef = useRef<LiveStatus>("off-duty");
  const elapsedRef = useRef(0);
  const workTypeRef = useRef(workType);
  const geofenceRef = useRef<Coordinate | null>(null);

  const distanceFromGeofence =
    location && geofenceCenter ? metersBetween(geofenceCenter, location) : null;
  const inBoundary =
    distanceFromGeofence === null ? true : distanceFromGeofence <= GEOFENCE_RADIUS_METERS;

  useEffect(() => {
    elapsedRef.current = elapsedTime;
  }, [elapsedTime]);

  useEffect(() => {
    workTypeRef.current = workType;
  }, [workType]);

  useEffect(() => {
    geofenceRef.current = geofenceCenter;
  }, [geofenceCenter]);

  useEffect(() => {
    statusRef.current = !isClockedIn
      ? "off-duty"
      : isOnBreak
        ? "on-break"
        : isPaused
          ? "paused"
          : "on-duty";
  }, [isClockedIn, isOnBreak, isPaused]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported on this device.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const nextAccuracy = position.coords.accuracy;
        const center = geofenceRef.current;
        const distance = center ? metersBetween(center, nextLocation) : null;

        setLocation(nextLocation);
        setAccuracy(nextAccuracy);
        setGeoError(null);

        if (!trackingAllowed) return;

        try {
          await updateLiveLocation({
            latitude: nextLocation.latitude,
            longitude: nextLocation.longitude,
            accuracy: nextAccuracy,
            status: statusRef.current,
            workType: workTypeRef.current,
            hoursWorked: Number((elapsedRef.current / 3600).toFixed(2)),
            geofenceLatitude: center?.latitude ?? null,
            geofenceLongitude: center?.longitude ?? null,
            geofenceRadius: GEOFENCE_RADIUS_METERS,
            distanceFromGeofence: distance === null ? null : Math.round(distance),
            inBoundary: distance === null ? true : distance <= GEOFENCE_RADIUS_METERS,
          });
          setPublishError(null);
        } catch (error) {
          console.error("Live location update failed:", error);
          setPublishError("Could not publish live GPS to Firestore.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setGeoError(error.message);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [trackingAllowed]);

  useEffect(() => {
    if (!isClockedIn || isPaused || isOnBreak) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isClockedIn, isPaused, isOnBreak]);

  useEffect(() => {
    if (!isOnBreak) return;

    const interval = setInterval(() => {
      setBreakTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOnBreak]);

  const buildClockLocation = useCallback(
    () =>
      location
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy,
            distanceFromGeofence:
              distanceFromGeofence === null ? null : Math.round(distanceFromGeofence),
            inBoundary,
          }
        : null,
    [accuracy, distanceFromGeofence, inBoundary, location],
  );

  const publishCurrentLiveLocation = useCallback(
    async ({
      status,
      nextElapsedTime = elapsedTime,
    }: {
      status: LiveStatus;
      nextElapsedTime?: number;
    }) => {
      if (!trackingAllowed || !location) return;

      await updateLiveLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: accuracy ?? 0,
        status,
        workType,
        hoursWorked: Number((nextElapsedTime / 3600).toFixed(2)),
        geofenceLatitude: geofenceCenter?.latitude ?? null,
        geofenceLongitude: geofenceCenter?.longitude ?? null,
        geofenceRadius: GEOFENCE_RADIUS_METERS,
        distanceFromGeofence:
          distanceFromGeofence === null ? null : Math.round(distanceFromGeofence),
        inBoundary,
      });
    },
    [
      accuracy,
      distanceFromGeofence,
      elapsedTime,
      geofenceCenter,
      inBoundary,
      location,
      trackingAllowed,
      workType,
    ],
  );

  const recordClockEvent = useCallback(
    async ({
      eventType,
      nextSessionId,
      status,
      nextElapsedTime = elapsedTime,
      nextBreakTime = breakTime,
    }: {
      eventType:
        | "clock-in"
        | "clock-out"
        | "pause"
        | "resume"
        | "break-start"
        | "break-end"
        | "heartbeat";
      nextSessionId: string;
      status: LiveStatus;
      nextElapsedTime?: number;
      nextBreakTime?: number;
    }) => {
      if (!trackingAllowed) return;

      try {
        await saveEmployeeClockEvent({
          data: {
            eventType,
            sessionId: nextSessionId,
            employeeEmail: "employee1@sinhas.ch",
            adminEmail: "admin@sinhas.ch",
            workType,
            status,
            elapsedSeconds: nextElapsedTime,
            breakSeconds: nextBreakTime,
            notes,
            location: buildClockLocation(),
          },
        });
        setMongoError(null);
      } catch (error) {
        console.error("MongoDB clock event failed:", error);
        setMongoError("Could not save the time clock event to MongoDB.");
      }
    },
    [breakTime, buildClockLocation, elapsedTime, notes, trackingAllowed, workType],
  );

  useEffect(() => {
    if (!isClockedIn || !sessionId || !trackingAllowed) return;

    const interval = setInterval(() => {
      void publishCurrentLiveLocation({
        status: statusRef.current,
        nextElapsedTime: elapsedRef.current,
      });
      void recordClockEvent({
        eventType: "heartbeat",
        nextSessionId: sessionId,
        status: statusRef.current,
        nextElapsedTime: elapsedRef.current,
        nextBreakTime: breakTime,
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [
    breakTime,
    isClockedIn,
    publishCurrentLiveLocation,
    recordClockEvent,
    sessionId,
    trackingAllowed,
  ]);

  const handleClockIn = async () => {
    if (!location) {
      alert("Location not available. Please enable location services.");
      return;
    }

    const nextSessionId = crypto.randomUUID();
    setGeofenceCenter(location);
    setSessionId(nextSessionId);
    setIsClockedIn(true);
    setElapsedTime(0);
    setBreakTime(0);

    await publishCurrentLiveLocation({
      status: "on-duty",
      nextElapsedTime: 0,
    });

    await recordClockEvent({
      eventType: "clock-in",
      nextSessionId,
      status: "on-duty",
      nextElapsedTime: 0,
      nextBreakTime: 0,
    });
  };

  const handleClockOut = async () => {
    await publishCurrentLiveLocation({
      status: "off-duty",
    });

    if (sessionId) {
      await recordClockEvent({
        eventType: "clock-out",
        nextSessionId: sessionId,
        status: "off-duty",
      });
    }

    setIsClockedIn(false);
    setIsPaused(false);
    setIsOnBreak(false);
    setSessionId(null);
  };

  const handleTogglePause = async () => {
    if (!sessionId) return;

    const nextPaused = !isPaused;
    await publishCurrentLiveLocation({
      status: nextPaused ? "paused" : "on-duty",
    });
    await recordClockEvent({
      eventType: nextPaused ? "pause" : "resume",
      nextSessionId: sessionId,
      status: nextPaused ? "paused" : "on-duty",
    });
    setIsPaused(nextPaused);
  };

  const handleToggleBreak = async () => {
    if (!sessionId) return;

    const nextOnBreak = !isOnBreak;
    await publishCurrentLiveLocation({
      status: nextOnBreak ? "on-break" : "on-duty",
    });
    await recordClockEvent({
      eventType: nextOnBreak ? "break-start" : "break-end",
      nextSessionId: sessionId,
      status: nextOnBreak ? "on-break" : "on-duty",
    });
    setIsOnBreak(nextOnBreak);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Work Session</CardTitle>
          <CardDescription>
            {trackingAllowed
              ? isClockedIn
                ? "Live GPS is streaming to admin@sinhas.ch"
                : "Clock in to start 100m geofence tracking"
              : "Live tracking is enabled only for employee1@sinhas.ch"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-center">
            <div className="mb-2 font-mono text-5xl font-bold text-primary">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-sm text-muted-foreground">
              {isOnBreak
                ? `On Break - ${formatTime(breakTime)}`
                : isPaused
                  ? "Paused"
                  : isClockedIn
                    ? "Active"
                    : "Not Started"}
            </div>
          </div>

          {geoError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{geoError}</AlertDescription>
            </Alert>
          )}

          {publishError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{publishError}</AlertDescription>
            </Alert>
          )}

          {mongoError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{mongoError}</AlertDescription>
            </Alert>
          )}

          {location && accuracy && accuracy > 50 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Location accuracy: {Math.round(accuracy)}m. Move somewhere with a clearer GPS
                signal.
              </AlertDescription>
            </Alert>
          )}

          {isClockedIn && !inBoundary && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You are outside the 100m geofence by{" "}
                {Math.max(0, Math.round((distanceFromGeofence ?? 0) - GEOFENCE_RADIUS_METERS))}m.
              </AlertDescription>
            </Alert>
          )}

          {!isClockedIn && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Work Type</label>
              <select
                value={workType}
                onChange={(event) => setWorkType(event.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option>On-Site Field Work</option>
                <option>Remote Work / Work from Home</option>
                <option>Office Administration</option>
                <option>Client Meeting</option>
                <option>Training / Development</option>
                <option>Maintenance & Support</option>
                <option>Other</option>
              </select>
            </div>
          )}

          {location && (
            <div className="space-y-3 rounded-lg bg-muted p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4" />
                Current Location
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Latitude: {location.latitude.toFixed(6)}</div>
                <div>Longitude: {location.longitude.toFixed(6)}</div>
                {accuracy && <div>Accuracy: +/-{Math.round(accuracy)}m</div>}
                <div>
                  Geofence: {geofenceCenter ? "100m from clock-in point" : "Starts at clock-in"}
                </div>
                {distanceFromGeofence !== null && (
                  <div className={inBoundary ? "text-green-600" : "text-red-600"}>
                    Distance from geofence center: {Math.round(distanceFromGeofence)}m
                  </div>
                )}
              </div>
            </div>
          )}

          {location ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">Live Location Map</h3>
                  <p className="text-xs text-muted-foreground">
                    Leaflet GPS view with accuracy and 100m geofence
                  </p>
                </div>
                <span
                  className={`rounded-md px-2 py-1 text-xs font-medium ${
                    inBoundary ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {geofenceCenter ? (inBoundary ? "Inside geofence" : "Outside geofence") : "Ready"}
                </span>
              </div>
              <EmployeeLocationMap
                location={location}
                accuracy={accuracy}
                geofenceCenter={geofenceCenter}
                inBoundary={inBoundary}
              />
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Enable location permission to show your live Leaflet map.
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {!isClockedIn ? (
              <Button
                onClick={handleClockIn}
                className="col-span-2 bg-green-600 text-white hover:bg-green-700"
              >
                <Clock className="mr-2 h-4 w-4" />
                Clock In
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleTogglePause}
                  variant="outline"
                  className={isPaused ? "bg-primary/10" : ""}
                >
                  {isPaused ? (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  )}
                </Button>
                <Button onClick={handleToggleBreak} variant={isOnBreak ? "default" : "outline"}>
                  {isOnBreak ? "End Break" : "Start Break"}
                </Button>
                <Button
                  onClick={handleClockOut}
                  className="col-span-2 bg-red-600 text-white hover:bg-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Clock Out
                </Button>
              </>
            )}
          </div>

          {isClockedIn && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Work Notes</label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add notes about your work activities..."
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
