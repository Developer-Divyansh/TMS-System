# Rota Management System - Demo Script

## Overview

This demo script provides a comprehensive walkthrough of the Rota Management System MVP, showcasing all key features and functionality for different user roles. The demo is designed to run for approximately 25-30 minutes with time allocated for each section.

## Demo Environment Setup

### Prerequisites
- Backend server running on http://localhost:3001
- Frontend application running on http://localhost:3000
- Demo data populated in the system
- Browser with two tabs open for quick user switching

### Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rotasystem.com | password123 |
| Manager | manager@rotasystem.com | password123 |
| Staff | john.doe@rotasystem.com | password123 |
| Staff | jane.smith@rotasystem.com | password123 |

## Demo Structure and Timing

### 1. Introduction and System Overview (2-3 minutes)

**Talking Points:**
- "Welcome to the Rota Management System MVP demo"
- "This comprehensive platform simplifies staff scheduling, time tracking, and communication"
- "Today I'll demonstrate how different users interact with the system"
- "The system features role-based access control, real-time scheduling, and automated notifications"

**Actions:**
- Show the login page
- Briefly explain the three user roles and their permissions
- Highlight the key benefits: efficient scheduling, time tracking, and improved communication

### 2. Admin Capabilities Demonstration (5-7 minutes)

**Login as Admin:**
1. Navigate to http://localhost:3000
2. Enter admin@rotasystem.com / password123
3. Click "Sign in"

**User Management (2 minutes):**
1. Navigate to "Users" in the navigation menu
2. Show the list of all users with their roles and teams
3. Click on "Add User" button
4. Fill in the form:
   - First name: "Demo"
   - Last name: "User"
   - Email: "demo.user@rotasystem.com"
   - Password: "password123"
   - Role: "Staff"
   - Phone: "+1234567890"
5. Assign to "Frontend Team"
6. Click "Create User"
7. Show the newly created user in the list
8. Click on the user to view details
9. Click "Edit User" to demonstrate editing capabilities

**Team Management (1.5 minutes):**
1. Navigate to "Users" > "Teams"
2. Show the list of teams with their managers
3. Click on "Frontend Team" to view team members
4. Click "Add Members" and show available users
5. Select a user and add to the team
6. Show the updated team member list

**System Overview and Analytics (1.5 minutes):**
1. Navigate to the Dashboard
2. Show system statistics (users, teams, shifts, etc.)
3. Navigate to "Reports" section
4. Show available reports and analytics
5. Explain how admins can monitor system usage and performance

**Notification Management (1 minute):**
1. Click on the bell icon to show notifications
2. Explain how admins can manage system-wide notifications
3. Show notification settings and preferences

### 3. Manager Capabilities Demonstration (5-7 minutes)

**Login as Manager:**
1. Open a new browser tab or incognito window
2. Navigate to http://localhost:3000
3. Enter manager@rotasystem.com / password123
4. Click "Sign in"

**View Team Schedule (2 minutes):**
1. Navigate to "Rota" in the navigation menu
2. Show the calendar view with team shifts
3. Explain the color coding for different shift types
4. Navigate between different weeks to show schedule range
5. Click on a shift to view detailed information

**Create and Assign Shifts (2 minutes):**
1. Click on an empty date in the calendar
2. Click "Add Shift" button
3. Fill in the form:
   - Select staff member: "John Doe"
   - Select shift type: "Morning"
   - Add notes: "Demo shift created during presentation"
4. Click "Create Shift"
5. Show the newly created shift in the calendar
6. Click on the shift to view details
7. Click "Edit Shift" to demonstrate editing capabilities

**Bulk Shift Creation (1 minute):**
1. Click "Bulk Create" button
2. Select date range (next week)
3. Select multiple staff members
4. Configure shift pattern
5. Click "Create Shifts"
6. Show the newly created shifts in the calendar

**Approve Timesheets (1.5 minutes):**
1. Navigate to "Timesheets" in the navigation menu
2. Filter by "Pending" status
3. Click on a timesheet to review details
4. Check hours worked, overtime, and notes
5. Click "Approve" button
6. Add approval notes: "Approved during demo"
7. Click "Confirm Approval"
8. Show the updated timesheet status

**View Team Notifications (0.5 minute):**
1. Click on the bell icon to show team notifications
2. Explain how managers stay informed about team activities

### 4. Staff Capabilities Demonstration (3-5 minutes)

**Login as Staff:**
1. Open a new browser tab or incognito window
2. Navigate to http://localhost:3000
3. Enter john.doe@rotasystem.com / password123
4. Click "Sign in"

**View Personal Schedule (1.5 minutes):**
1. Navigate to "Rota" in the navigation menu
2. Show the personal calendar view with assigned shifts
3. Navigate between different weeks
4. Click on an upcoming shift to view details
5. Explain the information available: shift time, duration, break, location, notes

**Clock In and Out Simulation (1.5 minutes):**
1. Find today's shift in the calendar
2. Click "Clock In" button (if available)
3. Explain the time tracking process
4. Navigate to "Timesheets" to see the time entry
5. Click "Clock Out" (if available)
6. Enter break duration: 30 minutes
7. Click "Confirm" to complete

**Submit Timesheet (1 minute):**
1. Navigate to "Timesheets" in the navigation menu
2. Find a completed shift timesheet
3. Click "Submit" to send for approval
4. Add notes: "Completed all assigned tasks"
5. Show the updated timesheet status
6. Explain the approval workflow

**View Notifications (0.5 minute):**
1. Click on the bell icon to show notifications
2. Explain how staff receive shift reminders and approval notifications

**Update Profile (0.5 minute):**
1. Click on profile picture/name in top right corner
2. Select "Profile" from dropdown menu
3. Show profile information
4. Update phone number if desired
5. Click "Save Changes"

### 5. Key Workflows Demonstration (5 minutes)

**Shift Creation Workflow (1.5 minutes):**
1. Login as Manager
2. Navigate to Rota calendar
3. Create a new shift for a staff member
4. Explain the shift creation process and considerations
5. Show how the shift appears in the staff member's calendar

**Timesheet Approval Workflow (1.5 minutes):**
1. Login as Staff
2. Submit a timesheet for a completed shift
3. Login as Manager
4. Review and approve the submitted timesheet
5. Login as Staff to see the approval notification

**Team Communication Workflow (1 minute):**
1. Login as Manager
2. Create a shift with specific notes for a staff member
3. Login as Staff to view the updated shift
4. Explain how the system facilitates communication

**Schedule Conflict Resolution (1 minute):**
1. Login as Manager
2. Attempt to create a conflicting shift
3. Show how the system highlights conflicts
4. Explain the conflict resolution process

### 6. Conclusion and Q&A (3-5 minutes)

**Summary of Key Features:**
- "Today we've demonstrated the comprehensive Rota Management System"
- "We've seen how Admins can manage users and teams"
- "We've explored how Managers can create schedules and approve timesheets"
- "We've experienced how Staff can view schedules and track time"

**Key Benefits:**
- "Streamlined scheduling process"
- "Automated time tracking and timesheet management"
- "Improved communication between managers and staff"
- "Real-time visibility into workforce management"

**Next Steps and Potential Enhancements:**
- "Mobile app for on-the-go access"
- "Advanced reporting and analytics"
- "Integration with payroll systems"
- "Automated shift allocation algorithms"
- "Leave management integration"
- "Skill-based scheduling"

**Q&A Session:**
- Open the floor for questions
- Address specific concerns about implementation
- Discuss customization options
- Explain scalability for larger organizations

## Demo Checklist

### Before Demo
- [ ] Verify backend server is running (http://localhost:3001)
- [ ] Verify frontend application is running (http://localhost:3000)
- [ ] Check all test accounts are working
- [ ] Verify demo data is populated
- [ ] Open browser tabs for quick user switching
- [ ] Test all critical features are functioning

### During Demo
- [ ] Follow timing guidelines for each section
- [ ] Ensure smooth transitions between user roles
- [ ] Highlight key features and benefits
- [ ] Encourage questions at appropriate times
- [ ] Handle technical issues gracefully

### After Demo
- [ ] Collect feedback from attendees
- [ ] Document any issues encountered
- [ ] Follow up on specific questions
- [ ] Schedule additional demos if needed

## Troubleshooting Guide

### Common Issues and Solutions

**Login Issues:**
- Problem: Unable to login with test credentials
- Solution: Verify user exists in database, check password hash, restart backend

**Shift Creation Issues:**
- Problem: Unable to create shifts
- Solution: Check user permissions, verify shift types exist, check team assignments

**Timesheet Issues:**
- Problem: Unable to submit timesheets
- Solution: Verify shift is completed, check user permissions, check approval workflow

**Performance Issues:**
- Problem: Slow response times
- Solution: Check database connections, verify network connectivity, restart services

**Display Issues:**
- Problem: UI not rendering correctly
- Solution: Clear browser cache, check frontend build, verify API responses

### Backup Plans

**If Backend Fails:**
- Use screenshots to demonstrate functionality
- Focus on UI/UX aspects
- Reschedule live demo for later

**If Frontend Fails:**
- Demonstrate API endpoints using curl or Postman
- Show backend functionality
- Use browser developer tools to debug issues

**If Test Data Issues:**
- Create new test users during demo
- Generate new shifts on the fly
- Explain data management capabilities

## Visual Aids

### Screenshots to Prepare

1. **Login Page**: Show the clean, intuitive login interface
2. **Admin Dashboard**: Display system overview and analytics
3. **User Management**: Show the comprehensive user management interface
4. **Team Management**: Display team organization and structure
5. **Shift Calendar**: Show the intuitive calendar view with color-coded shifts
6. **Timesheet Management**: Display the timesheet submission and approval workflow
7. **Notifications**: Show the notification system for different user roles
8. **Mobile View**: Display responsive design on mobile devices

### Diagrams to Prepare

1. **System Architecture**: Show the overall system architecture and data flow
2. **User Workflow**: Illustrate the workflows for different user roles
3. **Approval Process**: Diagram the timesheet approval workflow
4. **Notification Flow**: Show how notifications are generated and delivered

### Feature Comparison Matrix

| Feature | Admin | Manager | Staff |
|---------|-------|--------|-------|
| User Management | ✓ | Limited | ✗ |
| Team Management | ✓ | Own Teams | ✗ |
| Shift Creation | ✓ | ✓ | ✗ |
| Schedule Viewing | ✓ | ✓ | Own Only |
| Timesheet Submission | ✓ | ✓ | ✓ |
| Timesheet Approval | ✓ | ✓ | ✗ |
| Reports | ✓ | Limited | Basic |
| Notifications | ✓ | ✓ | ✓ |
| Profile Management | ✓ | ✓ | ✓ |

## Recording Instructions

### Technical Setup
- Use screen recording software (e.g., OBS, Camtasia)
- Record at 1920x1080 resolution
- Ensure clear audio quality
- Use cursor highlighting for important actions
- Add zoom-ins for detailed sections

### Recording Guidelines
- Practice the demo flow before recording
- Speak clearly and at a moderate pace
- Explain each action while performing it
- Include pauses for emphasis on key features
- Keep total recording time under 30 minutes

### Post-Production
- Add intro and outro slides
- Include callout boxes for important information
- Add background music at low volume
- Include contact information and next steps
- Export in multiple formats for different platforms

## FAQ

### General Questions

**Q: How scalable is the system?**
A: The system is built with scalability in mind and can handle hundreds of users and thousands of shifts. The architecture supports horizontal scaling for larger deployments.

**Q: Can the system be customized for our specific needs?**
A: Yes, the system is highly customizable. Shift types, workflows, and notifications can all be configured to match specific organizational requirements.

**Q: How is data security handled?**
A: All data is encrypted in transit and at rest. The system uses industry-standard authentication and authorization mechanisms to ensure data security.

### Technical Questions

**Q: What are the system requirements?**
A: The system requires a modern web browser and an internet connection. For self-hosting, we recommend a server with at least 4GB RAM and 2 CPU cores.

**Q: Can the system integrate with our existing tools?**
A: Yes, the system provides a comprehensive API that allows integration with HR systems, payroll software, and other business tools.

**Q: How is data backed up?**
A: The system supports automated daily backups with point-in-time recovery options. For cloud deployments, backups are managed automatically.

### Implementation Questions

**Q: How long does implementation take?**
A: Basic implementation can be completed within 2-4 weeks, depending on customization requirements and data migration needs.

**Q: What training is required?**
A: The system is designed to be intuitive. We provide initial training for administrators and managers, with comprehensive documentation for all users.

**Q: What ongoing support is available?**
A: We offer various support packages including email support, phone support, and dedicated account managers for enterprise customers.