# Quick Start Guide - Workforce Vision

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (2 min)
```bash
cd workforce-vision
npm install
```

### Step 2: Start Development Server (30 sec)
```bash
npm run dev
```

Server will start at: `http://localhost:5173`

### Step 3: Open Browser and Login (30 sec)
Visit: `http://localhost:5173/login`

### Step 4: Choose Your Role

#### 👤 **Try as Employee**
- **ID:** `EMP001`
- **Password:** `demo123`
- **Experience:** Work tracking, multimedia upload, daily reports

#### 👨‍💼 **Try as Admin**
- **ID:** `ADM001`
- **Password:** `admin123`
- **Experience:** Employee monitoring, report review, analytics

---

## 📋 Employee Workflow

### 1. Clock In
- Go to "Work Tracking" tab
- Click "Clock In" button
- System captures timestamp and location
- Timer starts automatically

### 2. Start Work
- Select work type from dropdown
- Add work notes (optional)
- System tracks time in real-time

### 3. Take Breaks
- Click "Start Break" to pause work timer
- Select break type (Lunch, Short, Prayer, etc.)
- Click "End Break" to resume

### 4. Upload Work Photos/Videos
- Go to "Multimedia" tab
- Drag and drop files or click to browse
- Supported: JPG, PNG (10MB), MP4, MOV, AVI (100MB)
- Click "Upload" when ready

### 5. Clock Out
- Click "Clock Out" button
- System saves work session
- Go to "Daily Report" tab

### 6. Submit Daily Report
- Review auto-calculated hours
- Check work type breakdown
- Add work description
- Click "Submit Report"
- Report sent for admin approval

### 7. View Profile
- Go to "Profile" tab
- View employment details
- Click "Edit Profile" to make changes
- Click "Save Changes" to update

---

## 👨‍💼 Admin Workflow

### 1. Monitor Employees
- Go to "Real-Time Monitoring" tab
- View all employees on duty
- Check current work status
- See location and hours worked

### 2. Review Reports
- Go to "Report Review" tab
- Select pending report from list
- Review employee details
- Check attached photos/videos
- Click "Approve Report" or "Reject Report"
- Add rejection reason if needed

### 3. View Analytics
- See employee statistics:
  - Total employees
  - Currently on duty
  - Boundary violations
  - Pending reports
- View work type distribution
- Check attendance rates

---

## 🎨 Main Features Overview

### ✨ Employee Features
- ⏱️ **Real-time Work Tracking** - Precise clock in/out with GPS
- 📸 **Multimedia Upload** - Photos and videos with auto-tagging
- 📋 **Daily Reports** - Auto-calculated work summaries
- 👤 **Profile Management** - Update personal information
- 🗺️ **Location Tracking** - Real-time GPS tracking
- ⏸️ **Break Management** - Multiple breaks per day
- 🏢 **Work Types** - Multiple predefined categories

### 👨‍💼 Admin Features
- 📊 **Live Monitoring** - Real-time employee status
- 🗺️ **Location Map** - View employee locations
- ✅ **Report Approval** - Review and approve daily reports
- 📈 **Analytics** - Comprehensive reporting
- 👥 **Employee Management** - Manage employee accounts
- ⚙️ **Configuration** - System settings

---

## 🔐 Test Scenarios

### Scenario 1: Employee Work Day
1. Login as EMP001
2. Clock In (9:00 AM)
3. Start break (12:00 PM - Lunch)
4. End break (12:30 PM)
5. Upload work photos (2 files)
6. Clock Out (5:30 PM)
7. Submit daily report
8. See "Report Submitted Successfully" message

### Scenario 2: Admin Review
1. Login as ADM001
2. Go to Real-Time Monitoring
3. See EMP001 in list (completed)
4. Go to Report Review
5. See pending report from EMP001
6. Review report details
7. Click "Approve Report"
8. See confirmation

### Scenario 3: 2FA Login
1. Try login with wrong password - See error
2. Try with correct password (demo123)
3. See OTP prompt
4. Enter test OTP: **123456**
5. Successfully logged in

---

## 🛠️ Configuration Quick Tips

### Change Location Update Frequency
Edit `src/lib/location.config.ts`:
```typescript
updateInterval: 900000, // Change to desired milliseconds
```

### Add New Work Type
Edit `src/lib/worktype.config.ts`:
```typescript
export const WORK_TYPES = [
  'Your New Work Type',
  // ... other types
];
```

### Modify Session Timeout
Edit `src/lib/auth.config.ts`:
```typescript
sessionTimeout: 30 * 60 * 1000, // 30 minutes
```

---

## 📱 Responsive Design

The app works perfectly on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

### Mobile Tips
- Use portrait mode for better UX
- Tap to upload media files
- Swipe between tabs (optional)

---

## 🎯 Common Tasks

### Change Password
(In development - implement in backend)
1. Go to Profile
2. Click "Change Password"
3. Enter old and new password
4. Confirm

### Download Reports
(Admin feature - ready for implementation)
1. Go to Analytics section
2. Select date range
3. Click "Download PDF" or "Download Excel"

### Export Employee Data
(Admin feature - ready for implementation)
1. Go to Employee Management
2. Click "Export CSV"
3. Select employees
4. Download file

---

## ⚠️ Known Limitations (Development Mode)

- 🔐 Authentication is demo-only (implement real auth in backend)
- 📍 GPS requires real device (use browser DevTools to mock location)
- 📧 Email/SMS not integrated (implement email service)
- 💾 Data resets on page refresh (connect to database)
- 🗺️ Map view is placeholder (integrate Google Maps API)

---

## 🐛 Troubleshooting

### Issue: App not loading
- **Solution:** Check if `npm run dev` is running
- **Port:** Ensure port 5173 is not in use

### Issue: Location not updating
- **Solution:** Check browser location permissions
- **Fix:** Allow location access in browser settings

### Issue: Files not uploading
- **Solution:** Check file size (max: 10MB for images, 100MB for videos)
- **Formats:** Use JPG, PNG for images; MP4, MOV, AVI for videos

### Issue: Login failing
- **Solution:** Use demo credentials exactly:
  - Employee: `EMP001` / `demo123`
  - Admin: `ADM001` / `admin123`

---

## 📚 Documentation

For more details, see:
- [README.md](README.md) - Full documentation
- [CONFIGURATION.md](CONFIGURATION.md) - Advanced configuration
- [API.md](API.md) - API reference
- [IMPLEMENTATION.md](IMPLEMENTATION.md) - Implementation details

---

## 🚀 Ready to Deploy?

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Build for Docker
```bash
docker build -t workforce-vision .
docker run -p 3000:3000 workforce-vision
```

---

## 💡 Tips & Tricks

1. **Use Demo Data** - Click on demo credentials to auto-fill login
2. **Test All Tabs** - Check each dashboard tab for features
3. **Try Admin View** - Logout and login as admin to see different interface
4. **Test 2FA** - Use codes 123456 or 000000
5. **Check Responsive** - Resize browser to test mobile view

---

## 📞 Need Help?

- Check [README.md](README.md) for comprehensive documentation
- See [CONFIGURATION.md](CONFIGURATION.md) for setup issues
- Review [API.md](API.md) for API questions
- Check browser console for error messages

---

**Enjoy using Workforce Vision! 🎉**

**Last Updated:** June 1, 2026
