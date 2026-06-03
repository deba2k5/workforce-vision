import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Download,
  Image as ImageIcon,
  FileVideo,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  type PendingReport,
} from "../../lib/liveTracking";
import { fetchPendingReports, updateReportStatusClient } from "../../lib/api/liveTracking.functions";

export function ReportReview() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [pendingReports, setPendingReports] = useState<PendingReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    (async () => {
      const reportsData = await fetchPendingReports();
      setPendingReports(reportsData as unknown as PendingReport[]);
      setLoading(false);
    })();

    // Poll MongoDB every second for updates
    const interval = setInterval(async () => {
      try {
        const reportsData = await fetchPendingReports();
        setPendingReports(reportsData as unknown as PendingReport[]);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const selectedReportData = pendingReports.find((r) => r.id === selectedReport);

  const handleApprove = async () => {
    if (!selectedReport) return;

    await updateReportStatusClient({ data: { reportId: selectedReport, status: "approved" } });
    setSelectedReport(null);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    if (!selectedReport) return;

    await updateReportStatusClient({ data: { reportId: selectedReport, status: "rejected", rejectionReason: rejectReason } });
    setSelectedReport(null);
    setRejectReason("");
    setShowRejectForm(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Reports List */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Work Reports</CardTitle>
            <CardDescription>Review and approve employee daily reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Files</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReports.map((report) => (
                    <TableRow
                      key={report.id}
                      onClick={() => setSelectedReport(report.id)}
                      className={`cursor-pointer ${selectedReport === report.id ? "bg-muted" : "hover:bg-muted/50"}`}
                    >
                      <TableCell className="font-medium">{report.employeeName}</TableCell>
                      <TableCell className="text-sm">{report.date}</TableCell>
                      <TableCell className="font-medium">{report.totalHours}h</TableCell>
                      <TableCell className="text-sm">{report.attachments}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Pending</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!loading && pendingReports.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-sm text-muted-foreground"
                      >
                        No submitted Firestore reports for employee1@sinhas.ch.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Details */}
      {selectedReportData ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Details</CardTitle>
              <CardDescription>{selectedReportData.date}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Employee Info */}
              <div className="pb-4 border-b">
                <p className="text-sm text-muted-foreground mb-1">Employee</p>
                <p className="font-semibold">{selectedReportData.employeeName}</p>
                <p className="text-xs text-muted-foreground">{selectedReportData.employeeId}</p>
              </div>

              {/* Work Summary */}
              <div className="pb-4 border-b">
                <p className="text-sm text-muted-foreground mb-2">Work Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Hours</span>
                    <span className="font-semibold">{selectedReportData.totalHours}h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Work Types</span>
                    <span className="text-xs">{selectedReportData.workTypes.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Attachments</span>
                    <span className="text-xs font-semibold">{selectedReportData.attachments}</span>
                  </div>
                </div>
              </div>

              {/* Work Types */}
              <div className="pb-4 border-b">
                <p className="text-sm text-muted-foreground mb-2">Work Types</p>
                <div className="space-y-1">
                  {selectedReportData.workTypes.map((type, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submitted Info */}
              <div className="pb-4 border-b">
                <p className="text-xs text-muted-foreground">Submitted at</p>
                <p className="text-sm font-medium">{selectedReportData.submittedAt}</p>
              </div>

              {/* Attachments Preview */}
              <div className="pb-4 border-b">
                <p className="text-sm text-muted-foreground mb-2">Attachments</p>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: selectedReportData.attachments }).map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg bg-muted border border-border flex items-center justify-center"
                    >
                      {idx % 2 === 0 ? (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      ) : (
                        <FileVideo className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {!showRejectForm ? (
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleApprove}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Report
                  </Button>
                  <Button
                    onClick={() => setShowRejectForm(true)}
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Report
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Provide reason for rejection..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleReject}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      disabled={!rejectReason.trim()}
                    >
                      Confirm Reject
                    </Button>
                    <Button
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectReason("");
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Select a report to view details
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
