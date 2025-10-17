import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ProtectedRoute } from '../../components/auth';
import { Button } from '../../components/common';
import api from '../../services/api';
import { Shift, Timesheet, Notification } from '../../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);
  const [recentTimesheets, setRecentTimesheets] = useState<Timesheet[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch user's upcoming shifts
        const shiftsResponse = await api.get('/api/shifts/my-shifts', {
          params: {
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          }
        });
        setUpcomingShifts(shiftsResponse.data.data.shifts || []);

        // Fetch recent timesheets
        const timesheetsResponse = await api.get('/api/timesheets/my-timesheets', {
          params: {
            limit: 5,
          }
        });
        setRecentTimesheets(timesheetsResponse.data.data.timesheets || []);

        // Fetch notifications
        const notificationsResponse = await api.get('/api/notifications', {
          params: {
            limit: 5,
            isRead: false,
          }
        });
        setNotifications(notificationsResponse.data.data.notifications || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getShiftStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300';
      case 'in_progress':
        return 'bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 border border-warning-300';
      case 'completed':
        return 'bg-gradient-to-r from-success-100 to-success-200 text-success-800 border border-success-300';
      case 'missed':
        return 'bg-gradient-to-r from-danger-100 to-danger-200 text-danger-800 border border-danger-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
    }
  };

  const getTimesheetStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
      case 'submitted':
        return 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-300';
      case 'approved':
        return 'bg-gradient-to-r from-success-100 to-success-200 text-success-800 border border-success-300';
      case 'rejected':
        return 'bg-gradient-to-r from-danger-100 to-danger-200 text-danger-800 border border-danger-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 bg-clip-text text-transparent">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-3 text-lg text-gray-600">Here's what's happening with your schedule today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {/* Upcoming Shifts */}
          <div className="bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-600 truncate">Upcoming Shifts</dt>
                    <dd className="mt-1 text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">{upcomingShifts.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 px-6 py-4 sm:px-8 border-t border-primary-100">
              <div className="text-sm">
                <Link href="/rota">
                  <Button variant="ghost" size="sm" className="w-full text-primary-700 hover:text-primary-800 font-semibold">
                    View all shifts →
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Timesheets */}
          <div className="bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-success-200 group">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-success-500 to-success-700 rounded-2xl p-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-600 truncate">Recent Timesheets</dt>
                    <dd className="mt-1 text-4xl font-bold bg-gradient-to-r from-success-600 to-success-800 bg-clip-text text-transparent">{recentTimesheets.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-success-50 to-success-100/50 px-6 py-4 sm:px-8 border-t border-success-100">
              <div className="text-sm">
                <Link href="/timesheets">
                  <Button variant="ghost" size="sm" className="w-full text-success-700 hover:text-success-800 font-semibold">
                    View all timesheets →
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-warning-200 group">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-warning-400 to-warning-600 rounded-2xl p-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-600 truncate">Unread Notifications</dt>
                    <dd className="mt-1 text-4xl font-bold bg-gradient-to-r from-warning-600 to-warning-800 bg-clip-text text-transparent">{notifications.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-warning-50 to-warning-100/50 px-6 py-4 sm:px-8 border-t border-warning-100">
              <div className="text-sm">
                <Link href="/notifications">
                  <Button variant="ghost" size="sm" className="w-full text-warning-700 hover:text-warning-800 font-semibold">
                    View all notifications →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100">
            <div className="px-6 py-6 sm:p-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-8">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/timesheets">
                  <Button className="w-full h-14 text-base">
                    <span className="mr-2 text-xl">📋</span>
                    Manage Timesheets
                  </Button>
                </Link>
                {user?.role.name !== 'Staff' && (
                  <Link href="/rota">
                    <Button variant="secondary" className="w-full h-14 text-base">
                      <span className="mr-2 text-xl">📅</span>
                      Manage Shifts
                    </Button>
                  </Link>
                )}
                <Link href="/users">
                  <Button variant="outline" className="w-full h-14 text-base">
                    <span className="mr-2 text-xl">👥</span>
                    Manage Users
                  </Button>
                </Link>
                <Link href="/rota">
                  <Button variant="outline" className="w-full h-14 text-base">
                    <span className="mr-2 text-xl">🗓️</span>
                    View Schedule
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Upcoming Shifts List */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100">
            <div className="px-6 py-6 sm:p-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-8">Upcoming Shifts</h3>
              {upcomingShifts.length > 0 ? (
                <div className="space-y-4">
                  {upcomingShifts.slice(0, 3).map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-primary-50 via-blue-50 to-primary-100 rounded-xl border-2 border-primary-200 hover:shadow-lg hover:border-primary-300 transition-all duration-300">
                      <div className="flex-1">
                        <p className="text-base font-bold text-gray-900">
                          {formatDate(shift.shiftDate)}
                        </p>
                        <p className="text-sm text-gray-700 mt-2 font-medium">
                          <span className="text-lg mr-1">⏰</span>
                          {formatTime(shift.shiftType.startTime)} - {formatTime(shift.shiftType.endTime)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${getShiftStatusColor(shift.status)}`}>
                        {shift.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center mb-4">
                    <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-600">No upcoming shifts</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Timesheets List */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100">
            <div className="px-6 py-6 sm:p-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-success-600 to-success-800 bg-clip-text text-transparent mb-8">Recent Timesheets</h3>
              {recentTimesheets.length > 0 ? (
                <div className="space-y-4">
                  {recentTimesheets.slice(0, 3).map((timesheet) => (
                    <div key={timesheet.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-success-50 via-green-50 to-success-100 rounded-xl border-2 border-success-200 hover:shadow-lg hover:border-success-300 transition-all duration-300">
                      <div className="flex-1">
                        <p className="text-base font-bold text-gray-900">
                          {formatDate(timesheet.workDate)}
                        </p>
                        <p className="text-sm text-gray-700 mt-2 font-medium">
                          <span className="text-lg mr-1">⏱️</span>
                          {timesheet.regularHours}h regular • {timesheet.overtimeHours}h overtime
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${getTimesheetStatusColor(timesheet.status)}`}>
                        {timesheet.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-success-100 to-success-200 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center mb-4">
                    <svg className="h-10 w-10 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-600">No recent timesheets</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DashboardPage;