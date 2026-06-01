import { useState } from 'react';
import { MapPin, Clock, AlertCircle, TrendingUp, Users, FileCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface EmployeeStatus {
  id: string;
  name: string;
  department: string;
  status: 'on-duty' | 'on-break' | 'off-duty';
  workType: string;
  hoursWorked: number;
  location: string;
  accuracy: number;
  inBoundary: boolean;
}

export function AdminDashboard() {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  // Mock data
  const liveEmployees: EmployeeStatus[] = [
    {
      id: 'EMP001',
      name: 'Ana Kowalski',
      department: 'Operations',
      status: 'on-duty',
      workType: 'On-Site Field Work',
      hoursWorked: 6.5,
      location: 'Building A, Floor 3',
      accuracy: 15,
      inBoundary: true,
    },
    {
      id: 'EMP002',
      name: 'James Wilson',
      department: 'Field Service',
      status: 'on-duty',
      workType: 'Remote Work',
      hoursWorked: 5.2,
      location: 'Home Office',
      accuracy: 8,
      inBoundary: true,
    },
    {
      id: 'EMP003',
      name: 'Sofia Garcia',
      department: 'Operations',
      status: 'on-break',
      workType: 'Office Administration',
      hoursWorked: 4.0,
      location: 'Cafeteria',
      accuracy: 12,
      inBoundary: true,
    },
    {
      id: 'EMP004',
      name: 'Michael Chen',
      department: 'Field Service',
      status: 'on-duty',
      workType: 'Client Meeting',
      hoursWorked: 3.5,
      location: 'Outside boundary',
      accuracy: 25,
      inBoundary: false,
    },
  ];

  const stats = {
    totalEmployees: 42,
    onDuty: 28,
    onBreak: 8,
    offDuty: 6,
    pendingReports: 5,
    boundaryViolations: 1,
  };

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case 'on-duty':
        return 'default';
      case 'on-break':
        return 'secondary';
      case 'off-duty':
        return 'outline';
      default:
        return 'default';
    }
  };

  const statusText = (status: string) => {
    switch (status) {
      case 'on-duty':
        return 'On Duty';
      case 'on-break':
        return 'On Break';
      case 'off-duty':
        return 'Off Duty';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground mt-1">Active in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Currently On Duty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.onDuty}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.onBreak} on break</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.boundaryViolations}</div>
            <p className="text-xs text-muted-foreground mt-1">Boundary violations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Pending Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{stats.pendingReports}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Employee Monitoring</CardTitle>
          <CardDescription>Live status and location of all employees</CardDescription>
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
                {liveEmployees.map((emp) => (
                  <TableRow key={emp.id} className={selectedEmployee === emp.id ? 'bg-muted' : ''}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(emp.status)}>
                        {statusText(emp.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{emp.workType}</TableCell>
                    <TableCell className="text-sm font-medium">{emp.hoursWorked}h</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {emp.location}
                        {!emp.inBoundary && (
                          <AlertCircle className="h-4 w-4 text-red-500 ml-1" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEmployee(emp.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Work Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { type: 'On-Site Field Work', hours: 156, percentage: 38 },
                { type: 'Office Administration', hours: 128, percentage: 31 },
                { type: 'Remote Work', hours: 92, percentage: 22 },
                { type: 'Client Meeting', hours: 34, percentage: 8 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{item.type}</span>
                    <span className="text-sm text-muted-foreground">{item.hours}h</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate (This Week)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                <div key={day} className="text-center">
                  <div className="text-2xl font-bold text-primary">92%</div>
                  <div className="text-xs text-muted-foreground">{day}</div>
                </div>
              ))}
              <div className="col-span-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">92%</div>
                  <div className="text-xs text-muted-foreground">Average</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
