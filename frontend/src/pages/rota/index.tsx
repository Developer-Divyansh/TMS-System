import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ProtectedRoute } from '../../components/auth';
import { Button } from '../../components/common';
import { Calendar } from '../../components/rota';
import api from '../../services/api';
import { Shift, ShiftType } from '../../types';

const RotaPage: React.FC = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch shift types
        const shiftTypesResponse = await api.get('/api/shifts/types');
        setShiftTypes(shiftTypesResponse.data.data);

        // Fetch shifts for the current month
        const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split('T')[0];
        const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString().split('T')[0];
        
        const shiftsParams: any = { startDate, endDate };
        
        // Staff can only see their own shifts
        if (user?.role.name === 'Staff') {
          shiftsParams.userId = user.id;
        }
        
        const shiftsResponse = await api.get('/api/shifts', { params: shiftsParams });
        setShifts(shiftsResponse.data.data.shifts || []);
      } catch (error) {
        console.error('Failed to fetch rota data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, currentMonth]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleShiftClick = (shift: Shift) => {
    // In a real application, this would open a modal with shift details
    console.log('Shift clicked:', shift);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
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
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getShiftsForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateString = selectedDate.toISOString().split('T')[0];
    return shifts.filter(shift => shift.shiftDate === dateString);
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
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your work schedule
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Calendar
              shifts={shifts}
              onDateClick={handleDateClick}
              onShiftClick={handleShiftClick}
            />
          </div>

          <div className="lg:col-span-1">
            {selectedDate ? (
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  
                  <div className="space-y-3">
                    {getShiftsForSelectedDate().length > 0 ? (
                      getShiftsForSelectedDate().map((shift) => (
                        <div key={shift.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {shift.shiftType.name}
                            </h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getShiftStatusColor(shift.status)}`}>
                              {shift.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 space-y-1">
                            <div>
                              {formatTime(shift.shiftType.startTime)} - {formatTime(shift.shiftType.endTime)}
                            </div>
                            <div>
                              Break: {shift.shiftType.breakDuration} minutes
                            </div>
                            {shift.user && (
                              <div>
                                Staff: {shift.user.firstName} {shift.user.lastName}
                              </div>
                            )}
                            {shift.team && (
                              <div>
                                Team: {shift.team.name}
                              </div>
                            )}
                            {shift.notes && (
                              <div>
                                Notes: {shift.notes}
                              </div>
                            )}
                          </div>
                          {user?.role.name !== 'Staff' && (
                            <div className="mt-3 flex space-x-2">
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              {shift.status === 'scheduled' && (
                                <Button size="sm">
                                  Start Shift
                                </Button>
                              )}
                              {shift.status === 'in_progress' && (
                                <Button size="sm">
                                  End Shift
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No shifts scheduled for this day</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Schedule Details
                  </h3>
                  <p className="text-sm text-gray-500">
                    Click on a date to view shift details
                  </p>
                </div>
              </div>
            )}

            {user?.role.name !== 'Staff' && (
              <div className="mt-6 bg-white rounded-lg shadow">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Shift Types
                  </h3>
                  <div className="space-y-2">
                    {shiftTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: type.color }}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{type.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatTime(type.startTime)} - {formatTime(type.endTime)} ({type.breakDuration}m break)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default RotaPage;