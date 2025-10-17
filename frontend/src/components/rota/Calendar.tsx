import React, { useState } from 'react';
import { Shift } from '../../types';

interface CalendarProps {
  shifts: Shift[];
  onDateClick?: (date: Date) => void;
  onShiftClick?: (shift: Shift) => void;
}

const Calendar: React.FC<CalendarProps> = ({ shifts, onDateClick, onShiftClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const getShiftsForDate = (date: Date) => {
    const dateString = formatDate(date);
    return shifts.filter(shift => shift.shiftDate === dateString);
  };
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };
  
  const getShiftTypeColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      '#3B82F6': 'bg-blue-100 text-blue-800 border-blue-300',
      '#8B5CF6': 'bg-purple-100 text-purple-800 border-purple-300',
      '#1F2937': 'bg-gray-100 text-gray-800 border-gray-300',
      '#10B981': 'bg-green-100 text-green-800 border-green-300',
      '#F59E0B': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      '#EF4444': 'bg-red-100 text-red-800 border-red-300',
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-300';
  };
  
  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-gray-200"></div>
      );
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayShifts = getShiftsForDate(date);
      const isToday = formatDate(date) === formatDate(new Date());
      
      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 overflow-y-auto cursor-pointer hover:bg-gray-50 ${isToday ? 'bg-blue-50' : ''}`}
          onClick={() => onDateClick && onDateClick(date)}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
            {dayShifts.length > 0 && (
              <span className="text-xs text-gray-500">{dayShifts.length} shift{dayShifts.length > 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="mt-1 space-y-1">
            {dayShifts.slice(0, 2).map((shift) => (
              <div
                key={shift.id}
                className={`text-xs p-1 rounded truncate border ${getShiftTypeColor(shift.shiftType.color)}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onShiftClick) onShiftClick(shift);
                }}
              >
                <div className="font-medium">{shift.shiftType.name}</div>
                <div className="text-xs opacity-75">
                  {formatTime(shift.shiftType.startTime)} - {formatTime(shift.shiftType.endTime)}
                </div>
              </div>
            ))}
            {dayShifts.length > 2 && (
              <div className="text-xs text-gray-500 text-center">
                +{dayShifts.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex space-x-2">
            <button
              type="button"
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={goToPreviousMonth}
            >
              Previous
            </button>
            <button
              type="button"
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={goToToday}
            >
              Today
            </button>
            <button
              type="button"
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={goToNextMonth}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-0">
        {weekDays.map((day) => (
          <div key={day} className="h-10 flex items-center justify-center border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;