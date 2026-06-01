# Workforce Vision - API Documentation

## Base URL

```
Production: https://api.workforcevision.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All API endpoints require authentication via Bearer token (JWT) in the Authorization header:

```bash
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Login

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "employeeId": "EMP001",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "requiresTwoFactor": true,
  "message": "OTP sent to registered email"
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 2. Verify Two-Factor Authentication

**Endpoint:** `POST /auth/verify-2fa`

**Request:**
```json
{
  "token": "temp_token_xyz",
  "code": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "requiresTwoFactor": false
}
```

---

### 3. Logout

**Endpoint:** `POST /auth/logout`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Employee Endpoints

### 1. Get Current Employee Profile

**Endpoint:** `GET /employees/me`

**Response (200):**
```json
{
  "employeeId": "EMP001",
  "fullName": "Ana Kowalski",
  "email": "ana.kowalski@company.com",
  "mobile": "+1234567890",
  "department": "Operations",
  "employmentType": "Permanent",
  "position": "Operations Lead",
  "manager": "John Smith",
  "dateOfJoining": "2023-01-15",
  "profilePhoto": "https://cdn.example.com/photo.jpg",
  "createdAt": "2023-01-15T10:00:00Z",
  "updatedAt": "2026-06-01T12:00:00Z"
}
```

---

### 2. Update Employee Profile

**Endpoint:** `PUT /employees/me`

**Request:**
```json
{
  "fullName": "Ana Kowalski",
  "email": "ana.new@company.com",
  "mobile": "+1234567891",
  "department": "Operations"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated employee object */ }
}
```

---

### 3. Get All Employees (Admin)

**Endpoint:** `GET /employees?department=Operations&page=1&limit=50`

**Query Parameters:**
- `department` (optional): Filter by department
- `status` (optional): active, inactive
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 50)

**Response (200):**
```json
{
  "success": true,
  "data": [
    { /* employee object */ },
    { /* employee object */ }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "pages": 3
  }
}
```

---

## Work Session Endpoints

### 1. Clock In

**Endpoint:** `POST /work/clock-in`

**Request:**
```json
{
  "workType": "On-Site Field Work",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 15
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "SESSION_001",
    "employeeId": "EMP001",
    "clockInTime": "2026-06-01T09:00:00Z",
    "workType": "On-Site Field Work",
    "status": "active"
  }
}
```

---

### 2. Clock Out

**Endpoint:** `POST /work/clock-out`

**Request:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 12
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "SESSION_001",
    "clockOutTime": "2026-06-01T17:30:00Z",
    "totalHours": 8.5,
    "status": "completed"
  }
}
```

---

### 3. Start Break

**Endpoint:** `POST /work/break/start`

**Request:**
```json
{
  "breakType": "Lunch Break"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "BREAK_001",
    "startTime": "2026-06-01T12:00:00Z",
    "type": "Lunch Break",
    "status": "active"
  }
}
```

---

### 4. End Break

**Endpoint:** `POST /work/break/end`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "BREAK_001",
    "endTime": "2026-06-01T12:30:00Z",
    "duration": 30
  }
}
```

---

### 5. Get Work Sessions

**Endpoint:** `GET /work/sessions?date=2026-06-01`

**Query Parameters:**
- `date` (required): YYYY-MM-DD format
- `status` (optional): active, completed, paused

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "SESSION_001",
      "clockInTime": "2026-06-01T09:00:00Z",
      "clockOutTime": "2026-06-01T17:30:00Z",
      "workType": "On-Site Field Work",
      "totalHours": 8.5,
      "breaks": [
        {
          "id": "BREAK_001",
          "type": "Lunch Break",
          "duration": 30
        }
      ]
    }
  ]
}
```

---

## Location Endpoints

### 1. Update Location

**Endpoint:** `POST /location/update`

**Request:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 15
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "accuracy": 15,
    "inBoundary": true,
    "timestamp": "2026-06-01T12:00:00Z"
  }
}
```

---

### 2. Get Location History

**Endpoint:** `GET /location/history?employeeId=EMP001&date=2026-06-01`

**Query Parameters:**
- `employeeId` (required): Employee ID
- `date` (optional): YYYY-MM-DD format
- `startTime` (optional): ISO 8601 timestamp
- `endTime` (optional): ISO 8601 timestamp

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "accuracy": 15,
      "inBoundary": true,
      "timestamp": "2026-06-01T12:00:00Z"
    }
  ]
}
```

---

### 3. Set Geofencing Boundaries

**Endpoint:** `POST /location/geofence` (Admin)

**Request:**
```json
{
  "name": "Main Office",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radius": 100,
  "enabled": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "GEOFENCE_001",
    "name": "Main Office",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radius": 100
  }
}
```

---

## Multimedia Upload Endpoints

### 1. Upload Media File

**Endpoint:** `POST /media/upload` (multipart/form-data)

**Request:**
```
POST /media/upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="work-photo.jpg"
Content-Type: image/jpeg

[binary file data]
------WebKitFormBoundary
Content-Disposition: form-data; name="reportId"

RPT001
------WebKitFormBoundary--
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "MEDIA_001",
    "fileName": "work-photo.jpg",
    "fileType": "image",
    "fileSize": 2048576,
    "fileUrl": "https://cdn.example.com/media/work-photo.jpg",
    "uploadedAt": "2026-06-01T12:00:00Z"
  }
}
```

---

### 2. Delete Media File

**Endpoint:** `DELETE /media/:mediaId`

**Response (200):**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## Report Endpoints

### 1. Submit Daily Report

**Endpoint:** `POST /reports/daily`

**Request:**
```json
{
  "date": "2026-06-01",
  "workTypes": [
    {
      "type": "On-Site Field Work",
      "hours": 5.5
    },
    {
      "type": "Office Administration",
      "hours": 3.0
    }
  ],
  "notes": "Completed project tasks and attended meetings",
  "mediaFileIds": ["MEDIA_001", "MEDIA_002"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "RPT001",
    "employeeId": "EMP001",
    "date": "2026-06-01",
    "totalHoursWorked": 8.5,
    "status": "submitted",
    "submittedAt": "2026-06-01T18:30:00Z"
  }
}
```

---

### 2. Get Pending Reports (Admin)

**Endpoint:** `GET /reports/pending?page=1&limit=50`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "RPT001",
      "employeeId": "EMP001",
      "employeeName": "Ana Kowalski",
      "date": "2026-06-01",
      "totalHoursWorked": 8.5,
      "status": "submitted",
      "submittedAt": "2026-06-01T18:30:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 50
  }
}
```

---

### 3. Approve Report (Admin)

**Endpoint:** `POST /reports/:reportId/approve`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "RPT001",
    "status": "approved",
    "approvedBy": "ADM001",
    "approvedAt": "2026-06-01T19:00:00Z"
  }
}
```

---

### 4. Reject Report (Admin)

**Endpoint:** `POST /reports/:reportId/reject`

**Request:**
```json
{
  "reason": "Please provide more details about work activities"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "RPT001",
    "status": "rejected",
    "rejectionReason": "Please provide more details about work activities",
    "rejectedAt": "2026-06-01T19:00:00Z"
  }
}
```

---

## Analytics Endpoints

### 1. Get Attendance Report

**Endpoint:** `GET /analytics/attendance?startDate=2026-06-01&endDate=2026-06-30&employeeId=EMP001`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "employeeId": "EMP001",
    "period": "2026-06-01 to 2026-06-30",
    "totalDays": 22,
    "presentDays": 20,
    "absentDays": 2,
    "attendanceRate": 90.91,
    "totalHoursWorked": 176.5
  }
}
```

---

### 2. Get Productivity Metrics

**Endpoint:** `GET /analytics/productivity?startDate=2026-06-01&period=daily`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-06-01",
      "employeeCount": 42,
      "averageHoursWorked": 8.2,
      "averageBreakTime": 0.75,
      "topWorkType": "On-Site Field Work",
      "attendanceRate": 95.2
    }
  ]
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters"
  }
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

### 404 - Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### 500 - Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Rate Limiting

- **Rate Limit:** 1000 requests per hour per IP
- **Headers:**
  - `X-RateLimit-Limit: 1000`
  - `X-RateLimit-Remaining: 999`
  - `X-RateLimit-Reset: 1622523600`

---

## Webhooks (Optional)

Subscribe to events:
- `employee.clocked_in`
- `employee.clocked_out`
- `report.submitted`
- `report.approved`
- `geofence.violated`

---

## SDK & Libraries

- **JavaScript:** `npm install @workforcevision/api-client`
- **Python:** `pip install workforce-vision-api`
- **Java:** Maven Central Repository

---

For API support, contact: api-support@sinhasgroup.com
