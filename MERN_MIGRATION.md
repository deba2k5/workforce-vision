# MERN Stack Migration Guide

This project has been migrated from **TanStack React Start** to a **MERN Stack** (MongoDB, Express, React, Node.js) architecture.

## Project Structure

```
workforce-vision/
├── server/                    # Express backend
│   ├── index.js             # Main Express app
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── workTracking.js  # Work tracking API routes
│   └── middleware/
│       └── errorHandler.js  # Error handling middleware
├── src/                      # React frontend
│   ├── main.tsx             # Vite entry point with React Router
│   ├── App.tsx              # Route definitions
│   ├── pages/
│   │   └── Dashboard.tsx    # Main dashboard page
│   ├── components/          # React components
│   └── lib/
│       └── api.ts           # API client functions
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration (client-side)
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file with:
```env
MONGODB_URI=mongodb+srv://sinhasapp:sinhasapp@sinhasapp.mhknlyr.mongodb.net/?appName=sinhasapp
PORT=5000
NODE_ENV=development
```

### 3. Development

Run both frontend and backend concurrently:
```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000 (Vite dev server with React)
- **Backend**: http://localhost:5000 (Express server)

The frontend proxies API requests to the backend automatically.

### 4. Production Build

Build only the frontend:
```bash
npm run build
```

### 5. Start Production Server

```bash
npm start
```

This serves:
- Frontend static files from `dist/`
- Backend API from `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Work Tracking
- `POST /api/work-tracking/save` - Save work data
- `GET /api/work-tracking/range` - Get work data for date range
- `POST /api/work-tracking/task` - Save task record
- `GET /api/work-tracking/tasks` - Get tasks for employee
- `POST /api/work-tracking/login` - Record employee login
- `POST /api/work-tracking/logout` - Record employee logout
- `GET /api/work-tracking/logins` - Get login records for date range
- `POST /api/work-tracking/heatmap` - Save heatmap data
- `GET /api/work-tracking/productivity-summary` - Get productivity summary

## Frontend Architecture

### Routing
Uses `react-router-dom` for client-side routing:
- `/` - Dashboard (authenticated)
- `/login` - Login page
- `/profile` - Employee profile
- Protected routes redirect to login if not authenticated

### State Management
Uses React hooks (`useState`, `useEffect`) for local state management. Consider adding:
- Redux or Zustand for global state
- React Query for server state management

### API Client
File: `src/lib/api.ts`
- Axios-based HTTP client
- Automatic token injection in Authorization header
- Error handling and response transformation

## Component Structure

### Updated Components
- **ActivityReport**: Now uses API client to fetch work data from MongoDB
- **TaskManager**: CRUD operations via API
- **LoginCalendar**: Login tracking via API
- **WorkingHourHeatmap**: Productivity data from API
- **Dashboard**: Main layout with tabs for all features

### Components to Update
Need to update the following components to use the API client:
- `TaskManager.tsx` - use `workTrackingAPI.saveTask`, `getTasks`
- `LoginCalendar.tsx` - use `workTrackingAPI.recordLogin`
- `WorkingHourHeatmap.tsx` - use `workTrackingAPI.saveHeatmapData`
- Auth components - use `authAPI.login`, `register`

## Database

### Collections
- `users` - User accounts (email, password, name, role)
- `employee_work_data` - Daily work tracking data
- `login_sessions` - Login/logout records
- `task_records` - Task management data
- `heatmap_data` - Hourly productivity data
- `daily_analytics` - Daily performance summaries

### Indexes
Automatically created on server startup:
- `employee_work_data`: `(employeeId, date)`, `createdAt`
- `login_sessions`: `(employeeId, loginTime)`, `createdAt`
- `task_records`: `(employeeId, createdAt)`, `status`

## Deployment

### Vercel Deployment

**Note:** Vercel's free tier does not support serverless Node.js for full-stack apps well. Consider using:
- **Railway.app** (recommended for MERN)
- **Render.com**
- **Fly.io**
- **Digital Ocean App Platform**

For Vercel free tier, use as static frontend only + separate backend.

### Railway Deployment (Recommended)

1. Push to GitHub
2. Go to https://railway.app/dashboard
3. Click "New Project" → "Deploy from GitHub"
4. Select `deba2k5/workforce-vision`
5. Add environment variable: `MONGODB_URI=...`
6. Deploy

Railway will automatically:
- Detect Node.js project
- Run `npm install && npm run build`
- Start with `npm start`
- Provide public URL

## Migration Checklist

✅ Removed TanStack React Start
✅ Added Express.js server
✅ Created MongoDB API routes
✅ Set up React Router for client-side routing
✅ Created API client layer
✅ Updated ActivityReport component
✅ Updated package.json scripts
✅ Created server directory structure

⏳ Still needed:
- [ ] Update all components to use new API client
- [ ] Update LoginPage to use authAPI
- [ ] Update EmployeeProfile to use API
- [ ] Add error boundaries
- [ ] Add loading states
- [ ] Add toast notifications
- [ ] Test all API endpoints
- [ ] Add environment variable validation
- [ ] Implement proper JWT tokens (replace current base64 auth)
- [ ] Add password hashing with bcrypt
- [ ] Add request validation/sanitization
- [ ] Deploy to production

## Troubleshooting

### Frontend can't reach backend
- Ensure backend is running on port 5000
- Check Vite proxy config in `vite.config.ts`
- Check CORS is enabled in Express

### MongoDB connection fails
- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas IP whitelist includes your IP
- Verify credentials are correct

### Build fails
- Clear `node_modules` and `dist`: `rm -rf node_modules dist && npm install`
- Check all import paths in components
- Verify TypeScript types are correct

## Next Steps

1. **Update all components** to use the new API client
2. **Add error handling** with toast notifications
3. **Implement proper authentication** with JWT tokens
4. **Add input validation** on both frontend and backend
5. **Set up CI/CD** pipeline for automated testing
6. **Deploy to production** on Railway or similar
7. **Add comprehensive tests** for API endpoints and components
8. **Monitor performance** and optimize queries

## Resources

- [Express.js Documentation](https://expressjs.com)
- [React Router Documentation](https://reactrouter.com)
- [MongoDB Node Driver](https://www.mongodb.com/docs/drivers/node)
- [Vite Configuration](https://vitejs.dev/config)
- [Axios Documentation](https://axios-http.com)
