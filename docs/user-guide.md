# Rota Management System - User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Roles and Access](#user-roles-and-access)
4. [Common Tasks](#common-tasks)
   - [Login and Logout](#login-and-logout)
   - [Viewing Your Schedule](#viewing-your-schedule)
   - [Clocking In and Out](#clocking-in-and-out)
   - [Submitting Timesheets](#submitting-timesheets)
   - [Viewing Notifications](#viewing-notifications)
5. [Admin Tasks](#admin-tasks)
   - [Managing Users](#managing-users)
   - [Managing Teams](#managing-teams)
   - [System Configuration](#system-configuration)
6. [Manager Tasks](#manager-tasks)
   - [Creating Shifts](#creating-shifts)
   - [Managing Schedules](#managing-schedules)
   - [Approving Timesheets](#approving-timesheets)
   - [Viewing Reports](#viewing-reports)
7. [Staff Tasks](#staff-tasks)
   - [Viewing Personal Schedule](#viewing-personal-schedule)
   - [Time Tracking](#time-tracking)
   - [Managing Profile](#managing-profile)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

## Introduction

The Rota Management System is a comprehensive platform designed to simplify staff scheduling, time tracking, and communication. This guide will help you navigate the system and make the most of its features.

## Getting Started

### Accessing the System

1. Open your web browser and navigate to the system URL (e.g., `http://localhost:3000`)
2. You will see the login page where you can enter your credentials

### First-Time Login

If you're logging in for the first time:
1. Use the credentials provided by your administrator
2. You will be prompted to change your password after the first login
3. Update your profile information with your current details

### Test Accounts

For demonstration purposes, the system includes these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rotasystem.com | password123 |
| Manager | manager@rotasystem.com | password123 |
| Staff | john.doe@rotasystem.com | password123 |
| Staff | jane.smith@rotasystem.com | password123 |

## User Roles and Access

The system has three user roles, each with different permissions:

### Admin
- Full system access
- Manage all users and teams
- Configure system settings
- Approve all timesheets
- View all reports

### Manager
- Manage team members
- Create and manage schedules
- Approve team timesheets
- View team reports

### Staff
- View personal schedule
- Clock in/out for shifts
- Submit timesheets
- View notifications
- Update personal profile

## Common Tasks

### Login and Logout

#### Login
1. Navigate to the login page
2. Enter your email and password
3. Click "Sign in" button
4. You will be redirected to your dashboard based on your role

#### Logout
1. Click on your profile picture/name in the top right corner
2. Select "Logout" from the dropdown menu
3. You will be redirected to the login page

### Viewing Your Schedule

1. From the dashboard, click on "Rota" in the navigation menu
2. Your schedule will be displayed in a calendar view
3. Use the date navigators to view different weeks/months
4. Click on any shift to see more details

### Clocking In and Out

#### Clock In
1. Navigate to your schedule or dashboard
2. Find your current shift
3. Click the "Clock In" button
4. The system will record the time and update the shift status

#### Clock Out
1. After completing your shift, find it in your schedule
2. Click the "Clock Out" button
3. Enter your break duration if applicable
4. Click "Confirm" to complete the clock out

### Submitting Timesheets

1. Navigate to "Timesheets" in the navigation menu
2. Click "Submit Timesheet" for the appropriate shift
3. Review the pre-filled information (hours worked, etc.)
4. Add any notes if needed
5. Click "Submit" to send for approval
6. You will receive a notification when the timesheet is approved or rejected

### Viewing Notifications

1. Click on the bell icon in the top navigation bar
2. Your notifications will be displayed in a dropdown
3. Click on any notification to view details
4. Notifications are automatically marked as read when viewed

## Admin Tasks

### Managing Users

#### Creating a New User
1. Navigate to "Users" in the navigation menu
2. Click "Add User" button
3. Fill in the user details:
   - First name and last name
   - Email address
   - Temporary password
   - Role assignment
   - Team assignments
4. Click "Create User" to save

#### Editing a User
1. Navigate to "Users" in the navigation menu
2. Find the user you want to edit and click on their name
3. Click "Edit User" button
4. Update the required information
5. Click "Save Changes" to update

#### Deactivating a User
1. Navigate to "Users" in the navigation menu
2. Find the user you want to deactivate and click on their name
3. Click "Edit User" button
4. Toggle the "Active" status to off
5. Click "Save Changes"

### Managing Teams

#### Creating a New Team
1. Navigate to "Users" > "Teams" in the navigation menu
2. Click "Add Team" button
3. Fill in team details:
   - Team name
   - Description
   - Assign a manager
4. Click "Create Team" to save

#### Adding Users to a Team
1. Navigate to "Users" > "Teams" in the navigation menu
2. Click on the team name
3. Click "Add Members" button
4. Select users from the available list
5. Click "Add to Team" to save

### System Configuration

#### Managing Shift Types
1. Navigate to "Rota" > "Shift Types" in the navigation menu
2. View existing shift types or create new ones:
   - Shift name
   - Start and end times
   - Break duration
   - Color for calendar display
3. Click "Save Shift Type" to create/update

#### Managing Notifications
1. Navigate to "Settings" > "Notifications" in the navigation menu
2. Configure notification preferences:
   - Email notifications
   - SMS notifications
   - In-app notifications
3. Click "Save Settings" to update

## Manager Tasks

### Creating Shifts

#### Creating a Single Shift
1. Navigate to "Rota" in the navigation menu
2. Click on the date in the calendar where you want to add a shift
3. Click "Add Shift" button
4. Fill in shift details:
   - Select staff member
   - Select shift type
   - Add notes if needed
5. Click "Create Shift" to save

#### Creating Multiple Shifts
1. Navigate to "Rota" in the navigation menu
2. Click "Bulk Create" button
3. Select date range and staff members
4. Configure shift pattern
5. Click "Create Shifts" to save all

### Managing Schedules

#### Editing a Shift
1. Navigate to "Rota" in the navigation menu
2. Find the shift you want to edit in the calendar
3. Click on the shift to view details
4. Click "Edit Shift" button
5. Update the required information
6. Click "Save Changes" to update

#### Deleting a Shift
1. Navigate to "Rota" in the navigation menu
2. Find the shift you want to delete in the calendar
3. Click on the shift to view details
4. Click "Delete Shift" button
5. Confirm deletion to remove

#### Resolving Conflicts
1. When creating shifts, the system will automatically detect conflicts
2. Conflicts will be highlighted in red in the calendar
3. Click on conflicting shifts to see details
4. Adjust shift times or assign different staff members

### Approving Timesheets

#### Reviewing Pending Timesheets
1. Navigate to "Timesheets" in the navigation menu
2. Filter by "Pending" status
3. Click on any timesheet to review details
4. Check hours worked, overtime, and notes

#### Approving a Timesheet
1. After reviewing, click "Approve" button
2. Add approval notes if needed
3. Click "Confirm Approval" to finalize

#### Rejecting a Timesheet
1. After reviewing, click "Reject" button
2. Add rejection reason explaining what needs to be corrected
3. Click "Confirm Rejection" to send back to staff

### Viewing Reports

#### Attendance Reports
1. Navigate to "Reports" > "Attendance" in the navigation menu
2. Select date range and team
3. View attendance statistics and individual records

#### Overtime Reports
1. Navigate to "Reports" > "Overtime" in the navigation menu
2. Select date range and team
3. View overtime hours and costs

## Staff Tasks

### Viewing Personal Schedule

1. Navigate to "Rota" in the navigation menu
2. Your personal schedule is displayed in the calendar view
3. Use the navigation controls to view different weeks/months
4. Click on any shift to see details like:
   - Shift time and duration
   - Break duration
   - Location or team
   - Notes from manager

### Time Tracking

#### Clocking In
1. When arriving for your shift, find it in your schedule
2. Click the "Clock In" button
3. The system will record the exact time
4. Your shift status will change to "In Progress"

#### Clocking Out
1. When completing your shift, find it in your schedule
2. Click the "Clock Out" button
3. Enter your break duration in minutes
4. Click "Confirm" to complete
5. The system will calculate total hours worked

#### Viewing Time History
1. Navigate to "Timesheets" in the navigation menu
2. View all your timesheets with their status
3. Filter by date range if needed
4. Click on any timesheet to see detailed information

### Submitting Timesheets

#### Automatic Submission
1. Timesheets are automatically created when you clock out
2. Review the auto-generated timesheet
3. Click "Submit" to send for approval
4. You'll receive notifications about approval status

#### Manual Submission
1. Navigate to "Timesheets" in the navigation menu
2. Click "Submit Timesheet" for any shift
3. Fill in the required information:
   - Work date
   - Clock in and out times
   - Break duration
   - Notes
4. Click "Submit" to send for approval

#### Updating Submitted Timesheets
1. Navigate to "Timesheets" in the navigation menu
2. Find the timesheet with "Rejected" or "Pending" status
3. Click on it to view details
4. Click "Edit" to update information
5. Click "Submit" to resend for approval

### Managing Profile

#### Updating Personal Information
1. Click on your profile picture/name in the top right corner
2. Select "Profile" from the dropdown menu
3. Update your information:
   - First name and last name
   - Phone number
   - Email (requires admin approval)
4. Click "Save Changes" to update

#### Changing Password
1. Click on your profile picture/name in the top right corner
2. Select "Profile" from the dropdown menu
3. Click "Change Password" button
4. Enter your current password
5. Enter and confirm your new password
6. Click "Update Password" to save

## Troubleshooting

### Login Issues

#### Forgotten Password
1. Click "Forgot Password?" on the login page
2. Enter your email address
3. Check your email for password reset instructions
4. Follow the link in the email to reset your password

#### Account Locked
1. Contact your administrator if your account is locked
2. They can unlock your account and provide a new password

### Schedule Issues

#### Missing Shift
1. Check if you're looking at the correct date range
2. Verify with your manager if the shift should be assigned
3. Check your notifications for any shift changes

#### Incorrect Shift Time
1. Contact your manager immediately
2. They can update the shift details
3. You'll receive a notification when the shift is updated

### Timesheet Issues

#### Unable to Submit Timesheet
1. Ensure you have clocked out for the shift
2. Check if the timesheet is already submitted
3. Contact your manager if the issue persists

#### Timesheet Rejected
1. Check the rejection reason in your notifications
2. Update the timesheet with the correct information
3. Resubmit for approval

## FAQ

### General Questions

**Q: Can I view my schedule on mobile devices?**
A: Yes, the system is responsive and works on mobile devices.

**Q: How far in advance can I see my schedule?**
A: You can view your schedule for any date range, though managers typically create schedules 2-4 weeks in advance.

**Q: Can I swap shifts with other staff members?**
A: Currently, shift swaps require manager approval. Contact your manager to arrange a swap.

### Technical Questions

**Q: What browsers are supported?**
A: The system supports all modern browsers including Chrome, Firefox, Safari, and Edge.

**Q: Is my data secure?**
A: Yes, all data is encrypted and transmitted using secure HTTPS connections.

**Q: How often is the data backed up?**
A: Data is backed up daily, with additional backups before major system updates.

### Feature Questions

**Q: Can I set up recurring shifts?**
A: Yes, managers can create recurring shift patterns using the bulk create feature.

**Q: How is overtime calculated?**
A: Overtime is automatically calculated based on hours worked beyond the standard shift duration.

**Q: Can I export my schedule?**
A: Yes, you can export your schedule to PDF or CSV format from the calendar view.

---

For additional support or questions not covered in this guide, please contact your system administrator or refer to the [API Documentation](./api-documentation.md).