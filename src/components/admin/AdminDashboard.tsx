import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet.heat";
import "leaflet-draw";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { AlertCircle, Clock, FileCheck, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  GEOFENCE_RADIUS_METERS,
  TRACKED_EMPLOYEE_EMAIL,
  type LiveLocation,
  seedTestLocationData,
} from "../../lib/liveTracking";
import { fetchLiveEmployee, fetchPendingReports } from "../../lib/api/liveTracking.functions";
import { updateLiveLocationMongo } from "../../lib/api/liveTracking.server";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).toString(),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
});

function statusBadgeVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  if (status === "on-duty") return "default";
  if (status === "on-break" || status === "paused") return "secondary";
  if (status === "off-duty") return "outline";
  return "destructive";
}

function statusText(status: string) {
  switch (status) {
    case "on-duty":
      return "On Duty";
    case "on-break":
      return "On Break";
    case "off-duty":
      return "Off Duty";
    case "paused":
      return "Paused";
    default:
      return status;
  }
}

function HeatLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length || !L.heatLayer) return;

    const layer = L.heatLayer(points, {
      radius: 28,
      blur: 18,
      maxZoom: 17,
      gradient: { 0.2: "#22c55e", 0.5: "#f59e0b", 1: "#ef4444" },
    }).addTo(map);

    return () => {
      layer.remove();
    };
  }, [map, points]);

  return null;
}

function RecenterMap({ employee }: { employee: LiveLocation }) {
  const map = useMap();

  useEffect(() => {
    map.setView([employee.latitude, employee.longitude], Math.max(map.getZoom(), 16));
  }, [employee.latitude, employee.longitude, map]);

  return null;
}

export function AdminDashboard() {
  const [employee, setEmployee] = useState<LiveLocation | null>(null);
  const [pendingReports, setPendingReports] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [isSeedingData, setIsSeedingData] = useState(false);

  useEffect(() => {
    // Fetch initial data
    (async () => {
      const [employeeData, reportsData] = await Promise.all([
        fetchLiveEmployee(),
        fetchPendingReports(),
      ]);
      setEmployee(employeeData);
      setPendingReports(reportsData.length);
    })();

    // Poll MongoDB every second for real-time updates
    const interval = setInterval(async () => {
      try {
        const [employeeData, reportsData] = await Promise.all([
          fetchLiveEmployee(),
          fetchPendingReports(),
        ]);
        setEmployee(employeeData);
        setPendingReports(reportsData.length);
      } catch (error) {
        console.error("Error fetching live data:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(interval);
  }, []);

  const lastSeenMs = employee?.lastUpdated?.getTime() ?? 0;
  const isOnline =
    Boolean(employee) && employee?.status !== "off-duty" && now - lastSeenMs <= 70000;
  const lastSeenText = employee?.lastUpdated
    ? employee.lastUpdated.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Never";

  const stats = {
    totalEmployees: employee ? 1 : 0,
    onDuty: isOnline && employee?.status === "on-duty" ? 1 : 0,
    onBreak: employee?.status === "on-break" ? 1 : 0,
    boundaryViolations: employee && !employee.inBoundary ? 1 : 0,
    pendingReports,
  };

  const heatPoints = useMemo<[number, number, number][]>(
    () =>
      employee ? [[employee.latitude, employee.longitude, employee.inBoundary ? 0.55 : 1]] : [],
    [employee],
  );

  const mapCenter: [number, number] = employee
    ? [employee.latitude, employee.longitude]
    : [47.3769, 8.5417];

  const handleSeedTestData = async () => {
    try {
      setIsSeedingData(true);
      await seedTestLocationData();
      // Fetch updated data immediately after seeding
      const [employeeData, reportsData] = await Promise.all([
        fetchLiveEmployee(),
        fetchPendingReports(),
      ]);
      setEmployee(employeeData);
      setPendingReports(reportsData.length);
    } catch (error) {
      console.error("Failed to seed test data:", error);
    } finally {
      setIsSeedingData(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="h-4 w-4" />
              Connected Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEmployees}</div>
            <p className="mt-1 text-xs text-muted-foreground">Only {TRACKED_EMPLOYEE_EMAIL}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              Currently On Duty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.onDuty}</div>
            <p className="mt-1 text-xs text-muted-foreground">{stats.onBreak} on break</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              Geofence Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.boundaryViolations}</div>
            <p className="mt-1 text-xs text-muted-foreground">100m boundary violations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileCheck className="h-4 w-4" />
              Pending Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{stats.pendingReports}</div>
            <p className="mt-1 text-xs text-muted-foreground">Firestore submitted reports</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Employee Map</CardTitle>
          <CardDescription>
            Leaflet map, cluster marker, heatmap, and 100m geofence for {TRACKED_EMPLOYEE_EMAIL}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {employee && (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted p-3">
              <div>
                <p className="text-sm font-medium">{employee.employeeName}</p>
                <p className="text-xs text-muted-foreground">
                  Last location update: {lastSeenText}
                </p>
              </div>
              <Badge variant={isOnline ? "default" : "outline"}>
                {isOnline ? "Online and active" : "Offline"}
              </Badge>
            </div>
          )}
          <div className="h-[430px] overflow-hidden rounded-lg border border-border">
            <MapContainer center={mapCenter} zoom={employee ? 16 : 12} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <HeatLayer points={heatPoints} />
              {employee && (
                <>
                  <RecenterMap employee={employee} />
                  {employee.geofenceLatitude && employee.geofenceLongitude && (
                    <Circle
                      center={[employee.geofenceLatitude, employee.geofenceLongitude]}
                      radius={employee.geofenceRadius || GEOFENCE_RADIUS_METERS}
                      pathOptions={{
                        color: employee.inBoundary ? "#16a34a" : "#dc2626",
                        fillColor: employee.inBoundary ? "#22c55e" : "#ef4444",
                        fillOpacity: 0.12,
                      }}
                    />
                  )}
                  <MarkerClusterGroup chunkedLoading>
                    <Marker position={[employee.latitude, employee.longitude]}>
                      <Popup>
                        <div className="space-y-1 text-sm">
                          <strong>{employee.employeeName}</strong>
                          <div>{isOnline ? statusText(employee.status) : "Offline"}</div>
                          <div>Accuracy: {Math.round(employee.accuracy)}m</div>
                          <div>
                            Lat/Lng: {employee.latitude.toFixed(6)}, {employee.longitude.toFixed(6)}
                          </div>
                          <div>Last update: {lastSeenText}</div>
                          <div>Boundary: {employee.inBoundary ? "Inside" : "Outside"}</div>
                        </div>
                      </Popup>
                    </Marker>
                  </MarkerClusterGroup>
                  <CircleMarker
                    center={[employee.latitude, employee.longitude]}
                    radius={10}
                    pathOptions={{
                      color: employee.inBoundary ? "#16a34a" : "#dc2626",
                      fillColor: employee.inBoundary ? "#22c55e" : "#ef4444",
                      fillOpacity: 0.35,
                    }}
                  />
                </>
              )}
            </MapContainer>
          </div>
          {!employee && (
            <p className="mt-3 text-sm text-muted-foreground">
              Waiting for employee1@sinhas.ch to allow GPS and publish a live location.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Real-Time Employee Monitoring</CardTitle>
          <CardDescription>Live Firestore status for the connected employee only</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Work Type</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employee ? (
                  <TableRow className={selectedEmployee === employee.employeeId ? "bg-muted" : ""}>
                    <TableCell className="font-medium">
                      <div>{employee.employeeName}</div>
                      <div className="text-xs text-muted-foreground">{employee.employeeEmail}</div>
                      <div className="mt-1">
                        <Badge variant={isOnline ? "default" : "outline"}>
                          {isOnline ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(employee.status)}>
                        {isOnline ? statusText(employee.status) : "Offline"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{employee.workType}</TableCell>
                    <TableCell className="text-sm font-medium">{employee.hoursWorked}h</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {employee.latitude.toFixed(5)}, {employee.longitude.toFixed(5)}
                        {!employee.inBoundary && (
                          <AlertCircle className="ml-1 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {employee.distanceFromGeofence === null
                          ? "No geofence started"
                          : `${employee.distanceFromGeofence}m from geofence center`}
                      </div>
                      <div className="text-xs text-muted-foreground">Last seen: {lastSeenText}</div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEmployee(employee.employeeId)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      <div className="space-y-3">
                        <p>No live Firestore data yet.</p>
                        <Button
                          onClick={handleSeedTestData}
                          disabled={isSeedingData}
                          variant="outline"
                          size="sm"
                        >
                          {isSeedingData ? "Creating test data..." : "Create Test Location Data"}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Or log in as employee1@sinhas.ch on the employee dashboard to start tracking.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
