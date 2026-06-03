import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

interface HourData {
  hour: string;
  productivity: number;
  tasks: number;
  activeTime: number;
}

interface DayData {
  day: string;
  avgProductivity: number;
  hoursWorked: number;
  tasksCompleted: number;
}

const HOUR_COLORS = {
  0: '#f3f4f6',
  1: '#e5e7eb',
  2: '#d1d5db',
  3: '#9ca3af',
  4: '#6b7280',
  5: '#4b5563',
};

export function WorkingHourHeatmap() {
  // Hourly data for a typical week
  const hourlyData: HourData[] = [
    { hour: '08:00', productivity: 65, tasks: 2, activeTime: 45 },
    { hour: '09:00', productivity: 85, tasks: 4, activeTime: 55 },
    { hour: '10:00', productivity: 92, tasks: 5, activeTime: 58 },
    { hour: '11:00', productivity: 88, tasks: 4, activeTime: 56 },
    { hour: '12:00', productivity: 72, tasks: 3, activeTime: 48 },
    { hour: '13:00', productivity: 55, tasks: 1, activeTime: 30 },
    { hour: '14:00', productivity: 70, tasks: 3, activeTime: 45 },
    { hour: '15:00', productivity: 89, tasks: 4, activeTime: 55 },
    { hour: '16:00', productivity: 85, tasks: 4, activeTime: 52 },
    { hour: '17:00', productivity: 78, tasks: 3, activeTime: 48 },
    { hour: '18:00', productivity: 65, tasks: 2, activeTime: 40 },
  ];

  // Daily performance data
  const dailyData: DayData[] = [
    { day: 'Monday', avgProductivity: 82, hoursWorked: 8.5, tasksCompleted: 6 },
    { day: 'Tuesday', avgProductivity: 78, hoursWorked: 8.2, tasksCompleted: 5 },
    { day: 'Wednesday', avgProductivity: 88, hoursWorked: 8.8, tasksCompleted: 7 },
    { day: 'Thursday', avgProductivity: 85, hoursWorked: 8.5, tasksCompleted: 6 },
    { day: 'Friday', avgProductivity: 72, hoursWorked: 7.5, tasksCompleted: 4 },
    { day: 'Saturday', avgProductivity: 40, hoursWorked: 2.0, tasksCompleted: 1 },
    { day: 'Sunday', avgProductivity: 0, hoursWorked: 0, tasksCompleted: 0 },
  ];

  // Weekly heatmap data (7 days x 10 hours)
  const weeklyHeatmapData = [
    { day: 'Mon', '8am': 65, '9am': 80, '10am': 90, '11am': 88, '12pm': 70, '1pm': 50, '2pm': 75, '3pm': 85, '4pm': 82, '5pm': 70 },
    { day: 'Tue', '8am': 60, '9am': 82, '10am': 88, '11am': 85, '12pm': 68, '1pm': 55, '2pm': 70, '3pm': 88, '4pm': 80, '5pm': 75 },
    { day: 'Wed', '8am': 70, '9am': 85, '10am': 95, '11am': 90, '12pm': 75, '1pm': 60, '2pm': 80, '3pm': 92, '4pm': 88, '5pm': 78 },
    { day: 'Thu', '8am': 68, '9am': 88, '10am': 92, '11am': 87, '12pm': 72, '1pm': 58, '2pm': 78, '3pm': 90, '4pm': 85, '5pm': 76 },
    { day: 'Fri', '8am': 55, '9am': 78, '10am': 85, '11am': 82, '12pm': 65, '1pm': 48, '2pm': 65, '3pm': 78, '4pm': 75, '5pm': 60 },
  ];

  // Generate heatmap grid
  const getHeatmapColor = (value: number) => {
    if (value === 0) return '#f3f4f6';
    if (value < 30) return '#fecaca';
    if (value < 50) return '#fda29b';
    if (value < 70) return '#fb7185';
    if (value < 85) return '#f43f5e';
    return '#be123c';
  };

  // Peak hours analysis
  const peakHour = hourlyData.reduce((max, curr) => curr.productivity > max.productivity ? curr : max);
  const lowestHour = hourlyData.reduce((min, curr) => curr.productivity < min.productivity ? curr : min);
  const avgProductivity = Math.round(hourlyData.reduce((sum, curr) => sum + curr.productivity, 0) / hourlyData.length);

  return (
    <div className="space-y-6">
      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{avgProductivity}%</div>
              <div className="text-xs text-muted-foreground mt-2">Avg Productivity</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{peakHour.hour}</div>
              <div className="text-xs text-muted-foreground mt-2">Peak Hour</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{lowestHour.hour}</div>
              <div className="text-xs text-muted-foreground mt-2">Lowest Hour</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">41.5h</div>
              <div className="text-xs text-muted-foreground mt-2">Total This Week</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Productivity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Productivity & Tasks</CardTitle>
          <CardDescription>Daily working hours breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="productivity" fill="#3b82f6" name="Productivity %" />
              <Line yAxisId="right" type="monotone" dataKey="tasks" stroke="#f59e0b" strokeWidth={2} name="Tasks" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Performance Overview</CardTitle>
          <CardDescription>Weekly productivity metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="avgProductivity" fill="#10b981" name="Avg Productivity %" />
              <Line yAxisId="right" type="monotone" dataKey="hoursWorked" stroke="#8b5cf6" strokeWidth={2} name="Hours Worked" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Productivity Heatmap</CardTitle>
          <CardDescription>Productivity levels by hour and day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Headers */}
              <div className="flex gap-2 mb-4">
                <div className="w-20 flex-shrink-0" />
                {['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'].map(hour => (
                  <div key={hour} className="w-12 h-12 flex items-center justify-center text-xs font-semibold text-muted-foreground flex-shrink-0">
                    {hour}
                  </div>
                ))}
              </div>

              {/* Heatmap rows */}
              {weeklyHeatmapData.map((row) => (
                <div key={row.day} className="flex gap-2 mb-2">
                  <div className="w-20 flex-shrink-0 flex items-center text-sm font-semibold">
                    {row.day}
                  </div>
                  {(['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'] as const).map(hour => (
                    <div
                      key={`${row.day}-${hour}`}
                      className="w-12 h-12 rounded flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 transition-all"
                      style={{ backgroundColor: getHeatmapColor(row[hour]) }}
                      title={`${row.day} ${hour}: ${row[hour]}%`}
                    >
                      {row[hour] > 0 ? Math.round(row[hour] / 10) : ''}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex items-center gap-4 text-xs flex-wrap">
              <span className="font-semibold">Productivity Level:</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatmapColor(0) }} />
                <span>0%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatmapColor(25) }} />
                <span>25%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatmapColor(50) }} />
                <span>50%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatmapColor(75) }} />
                <span>75%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: getHeatmapColor(100) }} />
                <span>100%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks by Hour Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Task Completion by Hour</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" type="category" name="Hour" />
              <YAxis dataKey="tasks" name="Tasks Completed" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Tasks Completed" data={hourlyData} fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
