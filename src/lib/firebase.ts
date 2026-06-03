import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrLReSFkJjT97hsg9Ls6b2-r8AFdp0pxc",
  authDomain: "wrc2025-b1cce.firebaseapp.com",
  projectId: "wrc2025-b1cce",
  storageBucket: "wrc2025-b1cce.firebasestorage.app",
  messagingSenderId: "837386632950",
  appId: "1:837386632950:web:0ab1f62b7dcbf36ef3b6d7",
  measurementId: "G-Y12L98QCTH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// Convert employee ID to email format
export const getEmployeeEmail = (employeeId: string): string => {
  return `${employeeId}@sinhas.ch`;
};

// Extract employee ID from email
export const getEmployeeIdFromEmail = (email: string): string => {
  return email.replace("@sinhas.ch", "");
};

// Login with email and password directly
export const loginWithEmailPassword = async (
  email: string,
  password: string,
): Promise<{ user: User; employeeId: string }> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return {
    user: userCredential.user,
    employeeId: getEmployeeIdFromEmail(userCredential.user.email || ""),
  };
};

// Firebase Authentication Functions (Legacy - kept for compatibility)
export const loginWithEmployee = async (
  employeeId: string,
  password: string,
): Promise<{ user: User; employeeId: string }> => {
  const email = getEmployeeEmail(employeeId);
  return loginWithEmailPassword(email, password);
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Optional: Function to create new employee accounts (admin only)
export const createEmployeeAccount = async (
  employeeId: string,
  password: string,
): Promise<User> => {
  const email = getEmployeeEmail(employeeId);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Get current user email as employee ID
export const getCurrentEmployeeId = (): string | null => {
  const currentUser = getCurrentUser();
  if (currentUser?.email) {
    return getEmployeeIdFromEmail(currentUser.email);
  }
  return null;
};
