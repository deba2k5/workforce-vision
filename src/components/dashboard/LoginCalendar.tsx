import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface LoginRecord {
  date: string;
  logged: boolean;
  loginTime?: string;
  logoutTime?: string;
}

export function LoginCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // March 2025
  const [loginRecords, setLoginRecords] = useState<Record<string, LoginRecord>>({
    '2025-03-01': { date: '2025-03-01', logged: true, loginTime: '09:00 AM', logoutTime: '05:30 PM' },
    '2025-03-02': { date: '2025-03-02', logged: true, loginTime: '08:45 AM', logoutTime: '06:00 PM' },
    '2025-03-03': { date: '2025-03-03', logged: false },
    '2025-03-04': { date: '2025-03-04', logged: true, loginTime: '09:30 AM', logoutTime: '05:00 PM' },
    '2025-03-05': { date: '2025-03-05', logged: true, loginTime: '09:00 AM', logoutTime: '05:45 PM' },
    '2025-03-06': { date: '2025-03-06', logged: true, loginTime: '08:30 AM', logoutTime: '05:30 PM' },
    '2025-03-07': { date: '2025-03-07', logged: false },
    '2025-03-08': { date: '2025-03-08', logged: false },
    '2025-03-09': { date: '2025-03-09', logged: true, loginTime: '09:15 AM', logoutTime: '06:00 PM' },
    '2025-03-10': { date: '2025-03-10', logged: true, loginTime: '09:00 AM', logoutTime: '05:30 PM' },
  });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const toggleLogin = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setLoginRecords(prev => ({
      ...prev,
      [dateStr]: {
        date: dateStr,
        logged: !prev[dateStr]?.logged,
        loginTime: prev[dateStr]?.logged ? undefined : '09:00 AM',
        logoutTime: prev[dateStr]?.logged ? undefined : '05:30 PM'
      }
    }));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days: (number | null)[] = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Statistics
  const logins = Object.values(loginRecords).filter(r => r.logged).length;
  const totalDays = Object.values(loginRecords).length;
  const attendanceRate = totalDays > 0 ? Math.round((logins / totalDays) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{logins}</div>
              <div className="text-xs text-muted-foreground mt-2">Days Logged In</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalDays}</div>
              <div className="text-xs text-muted-foreground mt-2">Days Tracked</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{attendanceRate}%</div>
              <div className="text-xs text-muted-foreground mt-2">Attendance Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Login Calendar</CardTitle>
          <CardDescription>Click on dates to mark login/logout</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">{monthName}</h3>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const record = loginRecords[dateStr];
              const isLogged = record?.logged || false;

              return (
                <button
                  key={day}
                  onClick={() => toggleLogin(day)}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center font-semibold text-sm transition-all ${
                    isLogged
                      ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100'
                      : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300 hover:bg-gray-100'
                  }`}
                  title={isLogged ? `Login: ${record?.loginTime || 'N/A'}\nLogout: ${record?.logoutTime || 'N/A'}` : 'No login'}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-50 border-2 border-green-500" />
              <span>Logged In</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-50 border-2 border-gray-200" />
              <span>No Login</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Login Details */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Login Details</CardTitle>
          <CardDescription>Last 10 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(loginRecords)
              .slice(-10)
              .reverse()
              .map(([dateStr, record]) => (
                <div key={dateStr} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    {record.logged && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {record.loginTime} - {record.logoutTime}
                      </p>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    record.logged
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {record.logged ? 'Present' : 'Absent'}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
