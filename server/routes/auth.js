import express from 'express';
import { getDB } from '../config/db.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Login route
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const db = getDB();
  const usersCollection = db.collection('users');

  const user = await usersCollection.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // In production, use bcrypt to hash/compare passwords
  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate a simple token (in production, use JWT)
  const token = Buffer.from(`${user._id}:${Date.now()}`).toString('base64');

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'employee',
    },
  });
}));

// Register route
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, name, role = 'employee' } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  const db = getDB();
  const usersCollection = db.collection('users');

  const existing = await usersCollection.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const result = await usersCollection.insertOne({
    email,
    password, // In production, hash this!
    name,
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const token = Buffer.from(`${result.insertedId}:${Date.now()}`).toString('base64');

  res.status(201).json({
    success: true,
    token,
    user: {
      id: result.insertedId,
      email,
      name,
      role,
    },
  });
}));

// Logout route
router.post('/logout', asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
}));

// Get current user
router.get('/me', asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const userId = new ObjectId(decoded[0]);

    const db = getDB();
    const user = await db.collection('users').findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}));

export default router;
