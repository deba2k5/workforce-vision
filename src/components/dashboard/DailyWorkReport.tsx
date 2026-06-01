import { useState } from 'react';
import { FileText, Send, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';

export function DailyWorkReport() {
  const [workType, setWorkType] = useState('On-Site Field Work');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock data
  const workData = {
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    totalHours: 8.5,
    totalBreak: 0.75,
    workTypes: [
      { type: 'On-Site Field Work', hours: 5.5 },
      { type: 'Office Administration', hours: 3.0 },
    ],
    attachedFiles: 4,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);

      // Reset form
      setTimeout(() => {
        setSubmitted(false);
        setDescription('');
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Report Submitted Successfully!</h3>
              <p className="text-sm text-green-700 mt-1">Your daily work report has been submitted for approval.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <div>
            <CardTitle>Daily Work Report</CardTitle>
            <CardDescription>{workData.date}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Work Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{workData.totalHours}</div>
            <div className="text-xs text-muted-foreground">Total Hours</div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{workData.totalBreak}</div>
            <div className="text-xs text-muted-foreground">Break Time</div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{workData.workTypes.length}</div>
            <div className="text-xs text-muted-foreground">Work Types</div>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{workData.attachedFiles}</div>
            <div className="text-xs text-muted-foreground">Attachments</div>
          </div>
        </div>

        {/* Work Type Breakdown */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Work Type Breakdown</h3>
          {workData.workTypes.map((wt, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">{wt.type}</span>
              <span className="text-sm font-semibold text-primary">{wt.hours}h</span>
            </div>
          ))}
        </div>

        {/* Location Map (Summary) */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Location Coverage</h3>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 text-center border border-blue-200">
            <div className="text-sm text-muted-foreground">Map view available in detailed report</div>
          </div>
        </div>

        {/* Additional Notes */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Work Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the work completed today, challenges faced, and any additional notes..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none"
              rows={4}
              required
            />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This report includes 4 attached photos/videos. Review them before submission.
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            disabled={submitting || !description.trim()}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {submitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
