import { useState, useEffect } from 'react';
import { Download, Loader2, FileText, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { workTrackingAPI } from '@/lib/api';

interface ActivityData {
  date: string;
  hoursWorked: number;
  tasksCompleted: number;
  logins: number;
  productivity: number;
}

interface ActivityReportProps {
  employeeId: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ActivityReport({ employeeId }: ActivityReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activityData, setActivityData] = useState<ActivityData[]>([
    { date: '2025-02-10', hoursWorked: 8.5, tasksCompleted: 5, logins: 1, productivity: 82 },
    { date: '2025-02-11', hoursWorked: 8.2, tasksCompleted: 4, logins: 1, productivity: 78 },
    { date: '2025-02-12', hoursWorked: 8.8, tasksCompleted: 6, logins: 1, productivity: 88 },
    { date: '2025-02-13', hoursWorked: 8.0, tasksCompleted: 4, logins: 1, productivity: 75 },
    { date: '2025-02-14', hoursWorked: 7.5, tasksCompleted: 3, logins: 1, productivity: 70 },
  ]);

  // Load activity data from MongoDB
  useEffect(() => {
    const loadActivityData = async () => {
      setIsLoading(true);
      try {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const response = await workTrackingAPI.getWorkDataRange(employeeId, startDate, endDate);
        
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          // Transform API data to ActivityData format
          const grouped: Record<string, ActivityData> = {};
          response.data.data.forEach((item: any) => {
            const dateStr = item.date instanceof Date ? item.date.toISOString().split('T')[0] : item.date;
            if (!grouped[dateStr]) {
              grouped[dateStr] = {
                date: dateStr,
                hoursWorked: 0,
                tasksCompleted: 0,
                logins: 1,
                productivity: 0,
              };
            }
            grouped[dateStr].hoursWorked += item.hoursWorked || 0;
            grouped[dateStr].tasksCompleted += item.tasksCompleted || 0;
            grouped[dateStr].productivity = Math.max(grouped[dateStr].productivity, item.productivity || 0);
          });

          const data = Object.values(grouped).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setActivityData(data.length > 0 ? data : activityData);
        }
      } catch (error) {
        console.error('Error loading activity data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivityData();
  }, [employeeId]);
                tasksCompleted: 0,
                logins: 0,
                productivity: 0,
              };
            }
            grouped[item.date].hoursWorked += item.hoursWorked || 0;
            grouped[item.date].tasksCompleted += item.tasksCompleted || 0;
            grouped[item.date].productivity = item.productivity || grouped[item.date].productivity;
          });

          setActivityData(Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date)));
        }
      } catch (error) {
        console.error('Error loading activity data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivityData();
  }, []);

  // Calculate statistics
  const stats = {
    totalHours: activityData.reduce((sum, d) => sum + d.hoursWorked, 0),
    totalTasks: activityData.reduce((sum, d) => sum + d.tasksCompleted, 0),
    totalLogins: activityData.reduce((sum, d) => sum + d.logins, 0),
    avgProductivity: Math.round(activityData.reduce((sum, d) => sum + d.productivity, 0) / activityData.filter(d => d.productivity > 0).length),
    workingDays: activityData.filter(d => d.hoursWorked > 0).length,
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header
      pdf.setFontSize(20);
      pdf.text('Employee Activity Report', pageWidth / 2, yPosition, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setTextColor(100);
      yPosition += 10;
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
      pdf.text('Ana Kowalski | Operations Lead', pageWidth / 2, yPosition + 5, { align: 'center' });

      // Summary Section
      yPosition += 20;
      pdf.setFontSize(14);
      pdf.setTextColor(0);
      pdf.text('Activity Summary (Last 30 Days)', 20, yPosition);

      yPosition += 15;
      pdf.setFontSize(10);
      const summaryData = [
        [`Total Hours Worked:`, `${stats.totalHours.toFixed(1)} hours`],
        [`Total Tasks Completed:`, `${stats.totalTasks} tasks`],
        [`Working Days:`, `${stats.workingDays} days`],
        [`Average Productivity:`, `${stats.avgProductivity}%`],
        [`Total Logins:`, `${stats.totalLogins} logins`],
      ];

      summaryData.forEach((row) => {
        pdf.text(row[0], 25, yPosition);
        pdf.setTextColor(0, 102, 204);
        pdf.text(row[1], 120, yPosition);
        pdf.setTextColor(0);
        yPosition += 7;
      });

      // Add page break if needed
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      // Detailed Table
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.text('Detailed Activity Log', 20, yPosition);

      yPosition += 10;
      pdf.setFontSize(9);

      // Table headers
      const headers = ['Date', 'Hours', 'Tasks', 'Productivity'];
      const colWidths = [50, 30, 30, 40];
      const startX = 20;

      pdf.setFillColor(200, 200, 200);
      headers.forEach((header, i) => {
        pdf.text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, yPosition, { align: 'left' });
      });

      yPosition += 7;
      pdf.setDrawColor(200);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 5;

      // Table data
      const displayData = activityData.slice(0, 15); // Show first 15 rows
      displayData.forEach((row) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }

        const dateStr = new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const data = [
          dateStr,
          `${row.hoursWorked}h`,
          `${row.tasksCompleted}`,
          `${row.productivity}%`
        ];

        data.forEach((cell, i) => {
          pdf.text(cell, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, yPosition);
        });

        yPosition += 7;

        // Alternating row colors
        if (Math.floor(yPosition / 7) % 2 === 0) {
          pdf.setFillColor(245, 245, 245);
        }
      });

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(150);
      pdf.text('This is an automated report generated by Workforce Vision', pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Download PDF
      pdf.save(`Activity_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Download Button */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <FileText className="h-5 w-5" />
            Activity Report
          </CardTitle>
          <CardDescription className="text-blue-800">Download your complete activity and performance report</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generatePDF} disabled={isGenerating} className="gap-2 bg-blue-600 hover:bg-blue-700">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF Report
              </>
            )}
          </Button>
          <p className="text-xs text-blue-800 mt-3">
            Your report includes: activity summary, hourly breakdown, task completion data, and productivity metrics
          </p>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalHours.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground mt-2">Total Hours</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalTasks}</div>
              <div className="text-xs text-muted-foreground mt-2">Tasks Done</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.workingDays}</div>
              <div className="text-xs text-muted-foreground mt-2">Work Days</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.avgProductivity}%</div>
              <div className="text-xs text-muted-foreground mt-2">Avg Productivity</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.totalLogins}</div>
              <div className="text-xs text-muted-foreground mt-2">Total Logins</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hours Worked Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hours Worked Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hoursWorked" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tasks Completed Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tasks Completed Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasksCompleted" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Productivity Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Productivity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="productivity" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Working Days', value: stats.workingDays },
                    { name: 'Days Off', value: 30 - stats.workingDays }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#e5e7eb" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Log</CardTitle>
          <CardDescription>Last 10 days of activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Hours</th>
                  <th className="text-left py-3 px-4 font-semibold">Tasks</th>
                  <th className="text-left py-3 px-4 font-semibold">Productivity</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {activityData.slice(-10).reverse().map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">{new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td className="py-3 px-4">{row.hoursWorked}h</td>
                    <td className="py-3 px-4">{row.tasksCompleted}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: row.productivity > 0 ? '#10b981' : '#e5e7eb' }} />
                        {row.productivity}%
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        row.hoursWorked > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {row.hoursWorked > 0 ? 'Active' : 'Off'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
