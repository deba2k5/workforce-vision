import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { loginWithEmailPassword, getEmployeeIdFromEmail } from '../../lib/firebase';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sinhas.ch');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email.trim()) {
        setError('Please enter your email address');
        setLoading(false);
        return;
      }

      if (!password) {
        setError('Please enter your password');
        setLoading(false);
        return;
      }

      // Firebase authentication with email directly
      const { user } = await loginWithEmailPassword(email, password);

      if (user && user.email) {
        // Store session
        localStorage.setItem('authToken', user.uid);
        localStorage.setItem('employeeId', getEmployeeIdFromEmail(user.email));
        localStorage.setItem('userEmail', user.email);

        // Determine role based on email - check if 'admin' is in the email
        const isAdmin = user.email.toLowerCase().includes('admin');
        const userRole = isAdmin ? 'SuperAdmin' : 'Employee';
        localStorage.setItem('userRole', userRole);

        console.log('Login successful:', { email: user.email, role: userRole });

        // Redirect to appropriate dashboard
        navigate({ to: userRole === 'SuperAdmin' ? '/admin' : '/dashboard' });
      }
    } catch (err: any) {
      // Handle different Firebase error codes
      const errorCode = err.code || '';

      if (errorCode === 'auth/user-not-found') {
        setError('Email not found. Please check your email address.');
      } else if (errorCode === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else if (errorCode === 'auth/too-many-requests') {
        setError('Too many login attempts. Please try again later.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Workforce Vision</h1>
          <p className="text-slate-400">Employee Work Tracking System</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-200">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., employee1@sinhas.ch"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-200">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="text-primary hover:text-primary/80 transition">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-lg transition mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Demo Credentials */}
            <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-400 font-medium mb-2">Firebase Login Info:</p>
              <p className="text-xs text-slate-300 font-semibold">Employee:</p>
              <p className="text-xs text-slate-400">
                Email: <span className="font-mono text-slate-100">employee1@sinhas.ch</span>
              </p>
              <p className="text-xs text-slate-300 font-semibold mt-2">Admin:</p>
              <p className="text-xs text-slate-400">
                Email: <span className="font-mono text-slate-100">admin@sinhas.ch</span>
              </p>
              <p className="text-xs text-slate-500 mt-3 italic">
                Create these Firebase accounts first to login.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 SINHA's Group of Companies. All rights reserved.
        </p>
      </div>
    </div>
  );
}
