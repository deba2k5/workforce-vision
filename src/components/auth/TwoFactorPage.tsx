import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Shield, AlertCircle, Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';

export function TwoFactorPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      setLoading(false);
      return;
    }

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otpCode === '123456' || otpCode === '000000') {
        localStorage.setItem('authToken', 'verified-token-' + Date.now());
        navigate({ to: '/dashboard' });
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setResendCountdown(30);
    setOtp(['', '', '', '', '', '']);
    setError(null);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify Your Identity</h1>
          <p className="text-slate-400">Enter the 6-digit code sent to your email/phone</p>
        </div>

        {/* 2FA Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Fields */}
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-lg bg-slate-700/50 border-2 border-slate-600 text-white placeholder:text-slate-400 focus:border-primary focus:outline-none transition disabled:opacity-50"
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-lg transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-2">Didn't receive the code?</p>
              <button
                type="button"
                disabled={resendCountdown > 0 || loading}
                onClick={handleResendOtp}
                className="text-primary hover:text-primary/80 disabled:text-slate-600 font-medium transition text-sm"
              >
                {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend OTP'}
              </button>
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 transition text-sm font-medium py-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Login
            </button>

            {/* Test OTP Info */}
            <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-400 font-medium mb-1">Test OTP Codes:</p>
              <p className="text-xs text-slate-300">
                <span className="font-mono text-slate-100">123456</span> or <span className="font-mono text-slate-100">000000</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
