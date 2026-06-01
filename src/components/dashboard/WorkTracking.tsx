import { useState, useEffect } from 'react';
import { Clock, MapPin, Pause, Play, LogOut, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import type { WorkSession } from '../../lib/types';

export function WorkTracking() {
  const [isClockkedIn, setIsClockkedIn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [workType, setWorkType] = useState('On-Site Field Work');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [breakTime, setBreakTime] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setAccuracy(position.coords.accuracy);
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isClockkedIn || isPaused || isOnBreak) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isClockkedIn, isPaused, isOnBreak]);

  // Break timer effect
  useEffect(() => {
    if (!isOnBreak) return;

    const interval = setInterval(() => {
      setBreakTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isOnBreak]);

  const handleClockIn = () => {
    if (!location) {
      alert('Location not available. Please enable location services.');
      return;
    }
    setIsClockkedIn(true);
    setElapsedTime(0);
    setBreakTime(0);
  };

  const handleClockOut = () => {
    setIsClockkedIn(false);
    setIsPaused(false);
    setIsOnBreak(false);
    // Save work session
    console.log('Work session saved');
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStartBreak = () => {
    setIsOnBreak(true);
  };

  const handleEndBreak = () => {
    setIsOnBreak(false);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Work Session</CardTitle>
          <CardDescription>
            {isClockkedIn ? 'You are currently clocked in' : 'Clock in to start tracking your work'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <div className="text-5xl font-bold font-mono text-primary mb-2">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-sm text-muted-foreground">
              {isOnBreak
                ? `On Break - ${formatTime(breakTime)}`
                : isPaused
                  ? 'Paused'
                  : isClockkedIn
                    ? 'Active'
                    : 'Not Started'}
            </div>
          </div>

          {/* Location Alert */}
          {location && accuracy && accuracy > 50 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Location accuracy: {Math.round(accuracy)}m - Consider moving to an area with better GPS signal
              </AlertDescription>
            </Alert>
          )}

          {/* Work Type Selection */}
          {!isClockkedIn && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Work Type</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
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

          {/* Location Display */}
          {location && (
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4" />
                Current Location
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Latitude: {location.latitude.toFixed(6)}</div>
                <div>Longitude: {location.longitude.toFixed(6)}</div>
                {accuracy && <div>Accuracy: ±{Math.round(accuracy)}m</div>}
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {!isClockkedIn ? (
              <Button
                onClick={handleClockIn}
                className="col-span-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Clock className="h-4 w-4 mr-2" />
                Clock In
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleTogglePause}
                  variant="outline"
                  className={isPaused ? 'bg-primary/10' : ''}
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
                <Button
                  onClick={isOnBreak ? handleEndBreak : handleStartBreak}
                  variant={isOnBreak ? 'default' : 'outline'}
                >
                  {isOnBreak ? 'End Break' : 'Start Break'}
                </Button>
                <Button
                  onClick={handleClockOut}
                  className="col-span-2 bg-red-600 hover:bg-red-700 text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Clock Out
                </Button>
              </>
            )}
          </div>

          {/* Notes Section */}
          {isClockkedIn && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Work Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about your work activities..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
