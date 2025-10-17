import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ProtectedRoute } from '../../components/auth';
import { Button, Modal, Input } from '../../components/common';
import api from '../../services/api';
import { Timesheet, Shift } from '../../types';

const TimesheetsPage: React.FC = () => {
  const { user } = useAuth();
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [formData, setFormData] = useState({
    shiftId: '',
    workDate: '',
    clockIn: '',
    clockOut: '',
    breakDuration: 0,
    notes: '',
  });

  useEffect(() => {
    const fetchTimesheets = async () => {
      try {
        // Fetch user's timesheets
        const timesheetsResponse = await api.get('/api/timesheets/my-timesheets');
        setTimesheets(timesheetsResponse.data.data.timesheets || []);

        // Fetch user's shifts for the dropdown
        const shiftsResponse = await api.get('/api/shifts/my-shifts');
        setShifts(shiftsResponse.data.data.shifts || []);
      } catch (error) {
        console.error('Failed to fetch timesheets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTimesheets();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'breakDuration' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that required fields are filled
    if (!formData.shiftId || !formData.workDate || !formData.clockIn || !formData.clockOut) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      // Format the data for the API
      const submitData = {
        ...formData,
        // Convert datetime-local format to ISO string
        clockIn: formData.clockIn ? new Date(formData.clockIn).toISOString() : '',
        clockOut: formData.clockOut ? new Date(formData.clockOut).toISOString() : '',
      };
      
      const response = await api.post('/api/timesheets', submitData);
      setTimesheets(prev => [response.data.data, ...prev]);
      setShowCreateModal(false);
      setFormData({
        shiftId: '',
        workDate: '',
        clockIn: '',
        clockOut: '',
        breakDuration: 0,
        notes: '',
      });
      alert('Timesheet submitted successfully!');
    } catch (error: any) {
      console.error('Failed to create timesheet:', error);
      alert(error.response?.data?.error?.message || 'Failed to submit timesheet. Please try again.');
    }
  };

  const handleApprove = async (timesheetId: string, approved: boolean) => {
    try {
      await api.patch(`/api/timesheets/${timesheetId}/approve`, {
        approved,
        notes: approved ? 'Approved' : 'Rejected',
      });
      
      setTimesheets(prev => 
        prev.map(ts => 
          ts.id === timesheetId 
            ? { ...ts, status: approved ? 'approved' : 'rejected' }
            : ts
        )
      );
    } catch (error) {
      console.error('Failed to approve timesheet:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimesheetStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalHours = (timesheet: Timesheet) => {
    return timesheet.regularHours + timesheet.overtimeHours;
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
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Timesheets</h1>
            <p className="mt-2 text-gray-600">
              Submit and track your work hours
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto h-12 text-base"
          >
            ➕ Submit Timesheet
          </Button>
        </div>

        {/* Timesheets List */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Recent Timesheets</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {timesheets.length > 0 ? (
              timesheets.map((timesheet) => (
                <li key={timesheet.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">📅</span>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatDate(timesheet.workDate)}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTimesheetStatusColor(timesheet.status)}`}>
                            {timesheet.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-start space-x-2">
                            <span className="text-green-600 mt-0.5">🟢</span>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Clock In</p>
                              <p className="text-sm text-gray-900">{formatDateTime(timesheet.clockIn || '')}</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-red-600 mt-0.5">🔴</span>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Clock Out</p>
                              <p className="text-sm text-gray-900">{formatDateTime(timesheet.clockOut || '')}</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-0.5">⏸️</span>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Break</p>
                              <p className="text-sm text-gray-900">{timesheet.breakDuration} minutes</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <span className="text-purple-600 mt-0.5">⏱️</span>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Total Hours</p>
                              <p className="text-sm text-gray-900 font-semibold">{calculateTotalHours(timesheet)}h</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTimesheet(timesheet)}
                            className="h-9"
                          >
                            👁️ View Details
                          </Button>
                          {user?.role.name !== 'Staff' && timesheet.status === 'submitted' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(timesheet.id, true)}
                                className="h-9 bg-green-600 hover:bg-green-700"
                              >
                                ✓ Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(timesheet.id, false)}
                                className="h-9 text-red-600 border-red-600 hover:bg-red-50"
                              >
                                ✗ Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-12 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 text-gray-600 text-base">No timesheets found</p>
                <p className="mt-1 text-gray-500 text-sm">Submit your first timesheet to get started.</p>
              </li>
            )}
          </ul>
        </div>

        {/* Create Timesheet Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="📝 Submit Timesheet"
          size="md"
          footer={
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="h-11"
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="h-11">
                ✓ Submit Timesheet
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="📅 Shift"
              name="shiftId"
              type="select"
              value={formData.shiftId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a shift</option>
              {shifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.shiftType.name} - {formatDate(shift.shiftDate)}
                </option>
              ))}
            </Input>
            
            <Input
              label="📆 Work Date"
              name="workDate"
              type="date"
              value={formData.workDate}
              onChange={handleInputChange}
              required
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="🟢 Clock In"
                name="clockIn"
                type="datetime-local"
                value={formData.clockIn}
                onChange={handleInputChange}
                required
              />
              
              <Input
                label="🔴 Clock Out"
                name="clockOut"
                type="datetime-local"
                value={formData.clockOut}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <Input
              label="⏸️ Break Duration (minutes)"
              name="breakDuration"
              type="number"
              value={formData.breakDuration}
              onChange={handleInputChange}
              min="0"
              placeholder="e.g., 30"
            />
            
            <Input
              label="📄 Notes (Optional)"
              name="notes"
              type="textarea"
              rows={4}
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional information about this timesheet..."
            />
          </form>
        </Modal>

        {/* View Timesheet Modal */}
        <Modal
          isOpen={!!selectedTimesheet}
          onClose={() => setSelectedTimesheet(null)}
          title="📋 Timesheet Details"
          size="md"
        >
          {selectedTimesheet && (
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">📆 Work Date</h4>
                <p className="text-base text-gray-900 font-medium">{formatDate(selectedTimesheet.workDate)}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="text-sm font-semibold text-green-700 mb-2">🟢 Clock In</h4>
                  <p className="text-base text-gray-900">{formatDateTime(selectedTimesheet.clockIn || '')}</p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="text-sm font-semibold text-red-700 mb-2">🔴 Clock Out</h4>
                  <p className="text-base text-gray-900">{formatDateTime(selectedTimesheet.clockOut || '')}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-700 mb-2">⏸️ Break Duration</h4>
                <p className="text-base text-gray-900">{selectedTimesheet.breakDuration} minutes</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="text-sm font-semibold text-purple-700 mb-2">Regular</h4>
                  <p className="text-xl text-gray-900 font-bold">{selectedTimesheet.regularHours}h</p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="text-sm font-semibold text-orange-700 mb-2">Overtime</h4>
                  <p className="text-xl text-gray-900 font-bold">{selectedTimesheet.overtimeHours}h</p>
                </div>
                
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <h4 className="text-sm font-semibold text-indigo-700 mb-2">⏱️ Total</h4>
                  <p className="text-xl text-gray-900 font-bold">{calculateTotalHours(selectedTimesheet)}h</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Status</h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getTimesheetStatusColor(selectedTimesheet.status)}`}>
                  {selectedTimesheet.status.toUpperCase()}
                </span>
              </div>
              
              {selectedTimesheet.notes && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-700 mb-2">📄 Notes</h4>
                  <p className="text-base text-gray-900">{selectedTimesheet.notes}</p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default TimesheetsPage;