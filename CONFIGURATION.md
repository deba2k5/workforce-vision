# Workforce Vision - Configuration Guide

## System Configuration

### 1. Environment Variables

Create a `.env.local` file in the project root:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Workforce Vision

# Location Services
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_GEOFENCE_DEFAULT_RADIUS=50

# Features
VITE_ENABLE_2FA=true
VITE_ENABLE_GPS_TRACKING=true
VITE_ENABLE_MULTIMEDIA=true

# Session
VITE_SESSION_TIMEOUT=1800000
VITE_OTP_EXPIRY=600000

# Database
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=workforce_vision
```

### 2. Geofencing Configuration

Set up geofencing boundaries for your locations:

```typescript
// src/lib/geofence.config.ts
export const GEOFENCE_BOUNDARIES = [
  {
    id: 'office-main',
    name: 'Main Office',
    latitude: 40.7128,
    longitude: -74.0060,
    radius: 100, // meters
    enabled: true,
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    latitude: 40.7580,
    longitude: -73.9855,
    radius: 150,
    enabled: true,
  },
];
```

### 3. Work Types Configuration

Customize available work types:

```typescript
// src/lib/worktype.config.ts
export const WORK_TYPES = [
  'On-Site Field Work',
  'Remote Work / Work from Home',
  'Office Administration',
  'Client Meeting',
  'Training / Development',
  'Maintenance & Support',
  'Other',
];

export const BREAK_TYPES = [
  'Lunch Break',
  'Short Break',
  'Prayer Break',
  'Other',
];
```

### 4. Location Update Frequency

Configure location tracking intervals:

```typescript
// src/lib/location.config.ts
export const LOCATION_CONFIG = {
  enableHighAccuracy: true,
  maximumAge: 30000,        // 30 seconds
  timeout: 27000,           // 27 seconds
  updateInterval: 900000,   // 15 minutes (in milliseconds)
};
```

### 5. File Upload Configuration

Configure multimedia upload limits:

```typescript
// src/lib/upload.config.ts
export const UPLOAD_CONFIG = {
  image: {
    maxSize: 10 * 1024 * 1024,  // 10 MB
    formats: ['image/jpeg', 'image/png'],
    extensions: ['jpg', 'jpeg', 'png'],
  },
  video: {
    maxSize: 100 * 1024 * 1024,  // 100 MB
    formats: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
    extensions: ['mp4', 'mov', 'avi'],
  },
};
```

### 6. Authentication Configuration

```typescript
// src/lib/auth.config.ts
export const AUTH_CONFIG = {
  twoFactorEnabled: true,
  sessionTimeout: 30 * 60 * 1000,  // 30 minutes
  otpExpiry: 10 * 60 * 1000,       // 10 minutes
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
};
```

---

## Database Setup

### PostgreSQL Schema

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees Table
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  department VARCHAR(100) NOT NULL,
  employment_type VARCHAR(20) NOT NULL,
  position VARCHAR(100) NOT NULL,
  manager VARCHAR(100),
  date_of_joining DATE NOT NULL,
  profile_photo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work Sessions Table
CREATE TABLE work_sessions (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  clock_in_time TIMESTAMP NOT NULL,
  clock_out_time TIMESTAMP,
  work_type VARCHAR(100) NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Location Data Table
CREATE TABLE location_data (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(10, 2) NOT NULL,
  in_boundary BOOLEAN NOT NULL,
  recorded_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Daily Reports Table
CREATE TABLE daily_reports (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  report_date DATE NOT NULL,
  total_hours_worked DECIMAL(5, 2) NOT NULL,
  total_break_time DECIMAL(5, 2) NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  submitted_at TIMESTAMP,
  approved_by VARCHAR(50),
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Media Files Table
CREATE TABLE media_files (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  report_id INTEGER,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(20) NOT NULL,
  file_size BIGINT NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  uploaded_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
  FOREIGN KEY (report_id) REFERENCES daily_reports(id)
);

-- Indexes
CREATE INDEX idx_employee_id ON employees(employee_id);
CREATE INDEX idx_work_sessions_employee ON work_sessions(employee_id);
CREATE INDEX idx_location_data_employee ON location_data(employee_id);
CREATE INDEX idx_daily_reports_employee ON daily_reports(employee_id);
CREATE INDEX idx_daily_reports_date ON daily_reports(report_date);
```

---

## Deployment Configuration

### Dockerization

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/workforce_vision
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=workforce_vision
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## Performance Optimization

### Caching Strategy

```typescript
// src/lib/cache.config.ts
export const CACHE_CONFIG = {
  employees: {
    ttl: 5 * 60 * 1000,      // 5 minutes
    maxSize: 100,
  },
  workSessions: {
    ttl: 2 * 60 * 1000,      // 2 minutes
    maxSize: 1000,
  },
  reports: {
    ttl: 10 * 60 * 1000,     // 10 minutes
    maxSize: 100,
  },
};
```

### Database Query Optimization

- Add indexes on frequently queried fields
- Use connection pooling (max 20 connections)
- Implement pagination (50 records per page)
- Use prepared statements

---

## Monitoring & Logging

### Logging Configuration

```typescript
// src/lib/logger.config.ts
export const LOG_CONFIG = {
  level: process.env.LOG_LEVEL || 'info',
  format: 'json',
  outputs: ['console', 'file'],
  maxFileSize: 10 * 1024 * 1024, // 10 MB
  maxBackupFiles: 10,
};
```

### Health Check Endpoint

```bash
GET /api/health
Response: { status: 'OK', timestamp: '2026-06-01T12:00:00Z' }
```

---

## Backup & Recovery

### Automated Backup

```bash
# Backup PostgreSQL
pg_dump -U user -d workforce_vision > backup-$(date +%Y%m%d).sql

# Restore from backup
psql -U user -d workforce_vision < backup-20260601.sql
```

### S3 Cloud Backup

```typescript
// src/lib/backup.ts
export async function backupToS3() {
  const s3 = new AWS.S3();
  const backup = await databaseBackup();
  
  await s3.putObject({
    Bucket: 'workforce-backups',
    Key: `backup-${Date.now()}.sql`,
    Body: backup,
  }).promise();
}
```

---

## Troubleshooting

### Common Issues

1. **Location not updating**
   - Check browser location permissions
   - Verify GPS accuracy settings
   - Ensure geofencing is enabled

2. **Authentication failures**
   - Clear browser cache and cookies
   - Verify OTP expiry time
   - Check 2FA configuration

3. **Slow report loading**
   - Check database indexes
   - Clear cache
   - Verify API response times

---

## Support

For configuration support, contact: support@sinhasgroup.com
