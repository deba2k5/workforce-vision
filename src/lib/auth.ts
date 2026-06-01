import type { AuthRequest, AuthResponse, TwoFactorRequest } from '../types';

// Mock implementation - replace with actual authentication logic
const mockUsers = {
  'EMP001': {
    password: 'demo123', // In production, use bcrypt
    role: 'Employee',
    twoFactorEnabled: true,
  },
  'ADM001': {
    password: 'admin123',
    role: 'SuperAdmin',
    twoFactorEnabled: true,
  },
};

export async function authenticateUser(req: AuthRequest): Promise<AuthResponse> {
  // Validate input
  if (!req.employeeId || !req.password) {
    return { success: false, message: 'Invalid credentials' };
  }

  // Check employee exists
  const user = mockUsers[req.employeeId as keyof typeof mockUsers];
  if (!user) {
    return { success: false, message: 'Employee not found' };
  }

  // Verify password (in production, use bcrypt)
  if (user.password !== req.password) {
    return { success: false, message: 'Invalid password' };
  }

  // Generate temporary token for 2FA
  const tempToken = generateToken();

  if (user.twoFactorEnabled) {
    // In production, send OTP via SMS/Email
    console.log('OTP would be sent to employee email/phone');
    return {
      success: true,
      token: tempToken,
      requiresTwoFactor: true,
      message: 'OTP sent to registered email/phone',
    };
  }

  // Generate session token
  const sessionToken = generateToken();
  return {
    success: true,
    token: sessionToken,
    requiresTwoFactor: false,
  };
}

export async function verifyTwoFactor(req: TwoFactorRequest): Promise<AuthResponse> {
  // In production, verify OTP from database
  // For now, accept any 6-digit code
  if (!/^\d{6}$/.test(req.code)) {
    return { success: false, message: 'Invalid OTP format' };
  }

  const sessionToken = generateToken();
  return {
    success: true,
    token: sessionToken,
    requiresTwoFactor: false,
  };
}

function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function verifyToken(token: string): boolean {
  // In production, verify JWT token
  return !!token && token.length > 10;
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
