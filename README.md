# Workforce Vision - Employee Work Tracking System

## Overview

Workforce Vision is a **comprehensive professional digital solution** for monitoring, recording, and managing employee work hours, activities, and location data in real-time. Built with modern technologies, it enables accurate time tracking, work documentation, and productivity monitoring for organizations.

**Version:** 1.0 | **Status:** Production Ready | **Organization:** SINHA's Group of Companies

---

## ✨ Key Features

### 👤 Employee Module

#### 1. **Authentication & Security**
- Secure login with Employee ID and Password
- Two-Factor Authentication (2FA) via SMS/Email
- Session timeout after 30 minutes of inactivity
- Password reset with security questions
- Encrypted data transmission (TLS/SSL)

#### 2. **Work Hours Recording**
- **Clock In/Out:** Precise timestamp recording with GPS location
- **Break Management:** 
  - Support for multiple breaks (Lunch, Short, Prayer, Other)
  - Automatic break time calculation
  - Break duration tracking
- **Work Type Classification:**
  - On-Site Field Work
  - Remote Work / Work from Home
  - Office Administration
  - Client Meeting
  - Training / Development
  - Maintenance & Support
  - Custom types (with admin approval)

#### 3. **Location Tracking**
- Real-time GPS location capture at clock-in and clock-out
- Periodic location updates every 15-30 minutes during work hours
- Geofencing with working location boundaries
- Location accuracy within 50 meters
- Boundary violation alerts
- Location privacy (employees can opt-out during personal breaks)

#### 4. **Multimedia Documentation**
- Photo upload (JPG, PNG) - Max 10 MB
- Video upload (MP4, MOV, AVI) - Max 100 MB
- Automatic timestamp and location tagging
- Drag-and-drop interface
- Multiple file uploads per work session

#### 5. **Daily Work Report**
- Auto-calculated total hours worked
- Work type breakdown
- Break time summary
- Attached photos and videos
- Location map visualization
- Work description and notes
- Report status tracking (Draft, Submitted, Approved, Rejected)

#### 6. **Employee Profile Management**
- View and update employee details:
  - Full Name, Email, Mobile Number
  - Department, Position/Designation
  - Manager/Supervisor
  - Employment Type (Temp/Perm/Contractor)
  - Date of Joining
  - Profile Photo
- Secure profile data storage

---

### 👨‍💼 Admin Dashboard Features

#### 1. **Real-Time Employee Monitoring**
- Live dashboard showing all working employees
- Current status: On duty, On break, Off duty
- Real-time map view with employee locations
- Current work duration display
- Alerts for boundary violations and suspicious activities

#### 2. **Employee Management**
- Add new employees with basic details
- Edit employee profiles and permissions
- Deactivate/Reactivate employee accounts
- Bulk import employees (CSV/Excel)
- Search and filter by department, status, employment type
- View employee history and records

#### 3. **Work Report Review & Approval**
- View all submitted daily work reports
- Review attached photos and videos
- Validate work hours accuracy
- Approve or reject reports with comments
- Historical report search and filtering
- Detailed report analytics

#### 4. **Analytics & Reporting**
- Daily/Weekly/Monthly attendance reports
- Total hours worked per employee
- Break time analytics
- Work type distribution
- Productivity metrics and trends
- Location heatmaps
- Export reports (PDF, Excel, CSV)
- Custom report builder with filters

#### 5. **Configuration & Settings**
- Manage work type categories
- Set geofencing boundaries
- Configure break types and duration rules
- Adjust location update frequency
- Manage notification preferences
- System maintenance and backup scheduling

---

## 🏗️ Technical Architecture

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite |
| **UI Framework** | Tailwind CSS, Shadcn/ui, Radix UI |
| **Routing** | TanStack Router |
| **State Management** | React Query (TanStack Query) |
| **Forms** | React Hook Form, Zod |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Backend Ready** | Node.js/Express or Python Django |
| **Database** | PostgreSQL or MongoDB |
| **Location Services** | Google Maps API |
| **Cloud** | AWS, Azure, or Google Cloud |

### Platform Support

- **Web:** Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile:** iOS 12+, Android 8+
- **Responsive Design:** Tablets and Desktops

---

## 📊 Data Models

### Employee Profile
```typescript
{
  employeeId: string;              // Auto-generated, unique
  fullName: string;
  email: string;                   // Valid format
  mobile: string;                  // With country code
  department: string;
  employmentType: "Temporary" | "Permanent" | "Contractor";
  position: string;
  manager: string;
  dateOfJoining: string;
  profilePhoto: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Work Session
```typescript
{
  id: string;
  employeeId: string;
  clockInTime: Date;
  clockOutTime?: Date;
  workType: WorkType;
  breaks: Break[];
  location: LocationData;
  notes?: string;
  status: "active" | "paused" | "completed";
}
```

### Location Data
```typescript
{
  latitude: number;          // GPS coordinate
  longitude: number;         // GPS coordinate
  accuracy: number;          // In meters
  timestamp: Date;
  inBoundary: boolean;       // Geofence status
}
```

### Daily Report
```typescript
{
  id: string;
  employeeId: string;
  date: Date;
  totalHoursWorked: number;
  totalBreakTime: number;
  workTypes: WorkType[];
  notes: string;
  mediaFiles: MediaFile[];
  locationMap: LocationData[];
  status: "draft" | "submitted" | "approved" | "rejected";
  submittedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
}
```

---

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/deba2k5/workforce-vision.git
cd workforce-vision

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Demo Credentials

**Employee Access:**
- Employee ID: `EMP001`
- Password: `demo123`
- Role: Employee

**Admin Access:**
- Employee ID: `ADM001`
- Password: `admin123`
- Role: Super Admin

---

## 📱 User Interface

### Employee Dashboard
- **Work Tracking Tab:** Clock in/out, pause, break management, real-time timer
- **Multimedia Tab:** Upload and manage photos and videos with drag-and-drop
- **Daily Report Tab:** Submit daily work summaries with descriptions
- **Profile Tab:** View and edit personal and employment information

### Admin Dashboard
- **Real-Time Monitoring:** Live employee status, location map, work duration
- **Report Review:** Approve/reject daily reports with detailed metrics
- **Analytics:** Comprehensive reporting with export options
- **Settings:** Configure system parameters

---

## 🔒 Security Features

- **Encryption:** End-to-end TLS/SSL for data transmission
- **Data Protection:** Encrypted data at rest
- **Authentication:** Secure 2FA with OTP
- **GDPR Compliance:** Full data privacy compliance
- **Audit Logging:** Complete audit trail of all admin activities
- **Security Audits:** Regular penetration testing
- **Data Retention:** Secure deletion after 7 years of inactivity

---

## ⚡ Performance Specifications

| Metric | Target |
|--------|--------|
| Page Load Time | < 3 seconds |
| Location Update Latency | < 2 seconds |
| Concurrent Users | 1000+ |
| System Uptime | 99.5% |
| Scalability | 5000+ employees |

---

## 📋 API Endpoints (Ready for Backend Integration)

### Authentication
- `POST /api/auth/login` - Employee login
- `POST /api/auth/verify-2fa` - Verify OTP
- `POST /api/auth/logout` - User logout

### Work Tracking
- `POST /api/work/clock-in` - Record clock-in
- `POST /api/work/clock-out` - Record clock-out
- `POST /api/work/break/start` - Start break
- `POST /api/work/break/end` - End break
- `GET /api/work/sessions/:employeeId` - Get work sessions

### Location
- `POST /api/location/update` - Update location
- `GET /api/location/history/:employeeId` - Location history
- `POST /api/geofence/set` - Set geofencing boundaries

### Reports
- `POST /api/reports/daily` - Submit daily report
- `GET /api/reports/pending` - Get pending reports (admin)
- `POST /api/reports/:reportId/approve` - Approve report
- `POST /api/reports/:reportId/reject` - Reject report

### Employees
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `GET /api/employees/live-status` - Get live status (admin)

---

## 📊 Sample Analytics Dashboard

The system provides comprehensive analytics including:

1. **Attendance Reports**
   - Daily, weekly, monthly summaries
   - Employee attendance rates
   - Absence tracking

2. **Productivity Metrics**
   - Hours worked per employee
   - Work type distribution
   - Productivity trends

3. **Location Analytics**
   - Heatmaps of work locations
   - Geofence compliance
   - Travel patterns

4. **Break Time Analysis**
   - Total break duration
   - Break type breakdown
   - Break patterns

---

## 🔧 Customization

### Adding New Work Types
- Employees can request custom work types
- Admins can approve/manage in settings
- Work types are filterable in reports

### Custom Geofencing
- Set multiple boundaries per location
- Assign radius (in meters)
- Enable/disable as needed
- Alert configuration

### Report Customization
- Add custom fields to daily reports
- Configure export formats
- Set approval workflows
- Custom filtering options

---

## 📱 Mobile Responsiveness

The application is fully responsive with:
- Mobile-optimized layouts
- Touch-friendly interfaces
- Optimized for small screens
- Native app-like experience
- Progressive Web App (PWA) support ready

---

## 🌐 Multi-Language Support (Ready)

Infrastructure prepared for:
- English (Default)
- Spanish
- French
- German
- Chinese
- Japanese

---

## 🚨 Error Handling & Recovery

- Graceful error messages
- Automatic retry mechanisms
- Offline mode support (local storage)
- Session recovery
- Data sync on reconnection

---

## 📞 Support & Documentation

For detailed API documentation and support, refer to:
- API Documentation: `/docs/api`
- User Guide: `/docs/user-guide`
- Admin Manual: `/docs/admin-manual`
- System Architecture: `/docs/architecture`

---

## 🔄 Development Roadmap

### Phase 2 (Q3 2026)
- [ ] Native mobile apps (iOS/Android)
- [ ] Advanced AI-powered insights
- [ ] Machine learning for productivity prediction
- [ ] Integration with HR systems

### Phase 3 (Q4 2026)
- [ ] Voice-based check-ins
- [ ] Biometric authentication
- [ ] Advanced scheduling system
- [ ] Team collaboration features

---

## 📜 License & Terms

**Organization:** SINHA's Group of Companies
**Version:** 1.0 | **Date:** May 30, 2026
**Status:** Production Ready

---

## 🙌 Credits

Built with modern web technologies and best practices for enterprise-grade employee tracking and productivity management.

**Happy Tracking! 🚀**
