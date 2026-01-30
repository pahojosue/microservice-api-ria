import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorApi, utils } from '../../services/preregService';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Doctor data
  const [doctorInfo, setDoctorInfo] = useState({
    id: 23,
    name: 'Dr. Amanda White',
    department: 'Dermatology',
    profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPpCKIM6jQRoLzodTqes9r94jeJbjC4U2jzT0MEkQwZkYWvPFl7Jp5POb5t7P1-wrpLlwKybzLDZdN0vziwqu6giqgi3Izm1lIz0shG7-vjGsW9ZsWsNLclRP2FJVN9eK0rPzzZd2SZvj0cnRIXkkhnLl6qG_YCOlITnxgbnfmyejyPUT7Ftf_qkxSLJ-J-J3ufog0Tc5I9fM6qIZGOzQNsKc7dhtjlcM3MzYtOmLgymhM2qISULIpz8Zfl49bOzWWSDbF7KWWTQLr'
  });
  
  // Appointments and requests
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [statistics, setStatistics] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
    completionRate: 0
  });
  
  // Calendar state
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  
  // Modal states
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get doctor ID properly - use utility function
      const doctorId = utils.getUserId() || 1;
      
      // Fetch data from backend
      const [requests, appointments, stats] = await Promise.all([
        doctorApi.getRequests(doctorId, 'pending'),
        doctorApi.getAppointments(doctorId, 'scheduled'),
        doctorApi.getAppointmentStatistics(doctorId)
      ]);
      
      // Process appointment requests
      if (Array.isArray(requests)) {
        setAppointmentRequests(requests.slice(0, 5));
      } else {
        console.error('Invalid requests data format:', requests);
        setAppointmentRequests([]);
      }
      
      // Process today's appointments
      if (Array.isArray(appointments)) {
        const today = new Date().toISOString().split('T')[0];
        const todays = appointments.filter(app => {
          if (!app.start_time) return false;
          const appDate = app.start_time.split('T')[0];
          return appDate === today;
        });
        setTodaysAppointments(todays.slice(0, 4));
        
        // Generate weekly schedule with real appointments
        generateWeeklySchedule(appointments);
      } else {
        console.error('Invalid appointments data format:', appointments);
        setTodaysAppointments([]);
        setWeeklySchedule([]);
      }
      
      // Set statistics
      if (stats) {
        setStatistics({
          totalAppointments: stats.total_appointments || 0,
          todayAppointments: stats.today_appointments || 0,
          upcomingAppointments: stats.upcoming_appointments || 0,
          completionRate: stats.completion_rate || 0,
          statusCounts: stats.status_counts || {}
        });
      } else {
        console.error('Invalid statistics data format:', stats);
        setStatistics({
          totalAppointments: 0,
          todayAppointments: 0,
          upcomingAppointments: 0,
          completionRate: 0
        });
      }
      
      // Try to fetch doctor profile
      try {
        const profile = await doctorApi.getDoctorProfile(doctorId);
        if (profile) {
          setDoctorInfo(prev => ({
            ...prev,
            name: profile.name || prev.name,
            department: profile.department || prev.department,
            specialty: profile.specialty || prev.specialty,
            profileImage: profile.profile_image || prev.profileImage
          }));
        }
      } catch (profileError) {
        console.log('Could not fetch doctor profile:', profileError);
        // Use default doctor info
      }
      
    } catch (err) {
      console.error('Error fetching doctor data:', err);
      setError(`Failed to load dashboard data: ${err.message}`);
      
      // Clear all data on error
      setAppointmentRequests([]);
      setTodaysAppointments([]);
      setWeeklySchedule([]);
      setStatistics({
        totalAppointments: 0,
        todayAppointments: 0,
        upcomingAppointments: 0,
        completionRate: 0
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const generateWeeklySchedule = (appointments) => {
    const weekStart = new Date(currentWeek);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    
    const schedule = [];
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'];
    
    // Create a map for quick lookup of appointments by date and time
    const appointmentMap = {};
    appointments.forEach(app => {
      if (!app.start_time) return;
      
      const appDate = new Date(app.start_time);
      const dateStr = appDate.toISOString().split('T')[0];
      const timeStr = appDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      if (!appointmentMap[dateStr]) {
        appointmentMap[dateStr] = {};
      }
      if (!appointmentMap[dateStr][timeStr]) {
        appointmentMap[dateStr][timeStr] = [];
      }
      
      appointmentMap[dateStr][timeStr].push({
        id: app.id,
        patient_name: app.patient_name || `Patient ${app.patient_id || 'Unknown'}`,
        start_time: app.start_time,
        type: 'patient',
        patient_id: app.patient_id
      });
    });
    
    // Generate schedule grid
    timeSlots.forEach(timeSlot => {
      const daySchedule = {
        time: timeSlot,
        days: []
      };
      
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        const dayStr = day.toISOString().split('T')[0];
        
        // Get appointments for this day and time slot
        const appointmentsForSlot = appointmentMap[dayStr]?.[timeSlot] || [];
        
        daySchedule.days.push({
          date: dayStr,
          appointments: appointmentsForSlot
        });
      }
      
      schedule.push(daySchedule);
    });
    
    setWeeklySchedule(schedule);
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const doctorId = utils.getUserId() || 1;
      const response = await doctorApi.acceptRequest(requestId, doctorId);
      
      if (response && response.appointment_id) {
        alert(`Request accepted! Appointment created: #${response.appointment_id}`);
      } else {
        alert('Request accepted successfully!');
      }
      
      fetchDoctorData();
      
      if (showRequestModal) {
        setShowRequestModal(false);
      }
    } catch (err) {
      console.error('Error accepting request:', err);
      alert(`Error: ${err.message}`);
      // Don't fall back to mock data - just show error
    }
  };

  const handleDeclineRequest = async (requestId) => {
    const reason = prompt('Please provide a reason for declining this request:');
    if (reason === null) return;
    
    try {
      const doctorId = utils.getUserId() || 1;
      await doctorApi.declineRequest(requestId, doctorId, reason);
      
      alert('Request declined successfully');
      fetchDoctorData();
      
      if (showRequestModal) {
        setShowRequestModal(false);
      }
    } catch (err) {
      console.error('Error declining request:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const doctorId = utils.getUserId() || 1;
      await doctorApi.completeAppointment(appointmentId, doctorId);
      
      alert('Appointment marked as completed');
      fetchDoctorData();
      
      if (showAppointmentModal) {
        setShowAppointmentModal(false);
      }
    } catch (err) {
      console.error('Error completing appointment:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    const reason = prompt('Please provide a reason for cancelling this appointment:');
    if (reason === null) return;
    
    try {
      const doctorId = utils.getUserId() || 1;
      await doctorApi.cancelAppointment(appointmentId, doctorId, reason);
      
      alert('Appointment cancelled successfully');
      fetchDoctorData();
      
      if (showAppointmentModal) {
        setShowAppointmentModal(false);
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      return new Date(dateTimeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return dateTimeString;
    }
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const getDayNumber = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const changeWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    if (direction === 'prev') {
      newWeek.setDate(newWeek.getDate() - 7);
    } else if (direction === 'next') {
      newWeek.setDate(newWeek.getDate() + 7);
    } else if (direction === 'today') {
      newWeek.setTime(Date.now());
    }
    setCurrentWeek(newWeek);
    
    // Fetch appointments for the new week
    const doctorId = utils.getUserId() || 1;
    const weekStart = new Date(newWeek);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const startDate = weekStart.toISOString().split('T')[0];
    const endDate = weekEnd.toISOString().split('T')[0];
    
    doctorApi.getAppointments(doctorId, null, startDate, endDate, true)
      .then(appointments => {
        if (Array.isArray(appointments)) {
          generateWeeklySchedule(appointments);
        }
      })
      .catch(err => console.error('Error fetching week appointments:', err));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDoctorData();
  };

  const openRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const openAppointmentDetails = async (appointment) => {
    try {
      const doctorId = utils.getUserId() || 1;
      const details = await doctorApi.getAppointmentDetailsFull(appointment.id, doctorId);
      setSelectedAppointment(details);
      setShowAppointmentModal(true);
    } catch (err) {
      console.error('Error fetching appointment details:', err);
      // Use basic appointment info if details fetch fails
      setSelectedAppointment(appointment);
      setShowAppointmentModal(true);
    }
  };

  const generateWeekDays = () => {
    const weekStart = new Date(currentWeek);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      const dateStr = day.toISOString().split('T')[0];
      
      days.push({
        date: dateStr,
        name: getDayName(dateStr),
        number: getDayNumber(dateStr),
        isToday: isToday(dateStr),
        isWeekend: isWeekend(dateStr)
      });
    }
    
    return days;
  };

  const weekDays = generateWeekDays();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-3">
            <div className="size-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-[#0d141b] dark:text-white text-lg font-bold leading-tight tracking-tight">
              MedHealth Pro
            </h2>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button 
              className="text-[#4c739a] hover:text-primary dark:text-slate-400 dark:hover:text-white text-sm font-medium"
              onClick={() => navigate('/doctor/dashboard')}
            >
              Dashboard
            </button>
            <button 
              className="text-primary text-sm font-bold border-b-2 border-primary pb-1"
              onClick={() => navigate('/doctor/schedule')}
            >
              Schedule
            </button>
            <button 
              className="text-[#4c739a] hover:text-primary dark:text-slate-400 dark:hover:text-white text-sm font-medium"
              onClick={() => navigate('/doctor/patients')}
            >
              Patients
            </button>
            <button 
              className="text-[#4c739a] hover:text-primary dark:text-slate-400 dark:hover:text-white text-sm font-medium"
              onClick={() => navigate('/doctor/learning')}
            >
              Learning
            </button>
            <button 
              className="text-[#4c739a] hover:text-primary dark:text-slate-400 dark:hover:text-white text-sm font-medium"
              onClick={() => navigate('/doctor/reports')}
            >
              Reports
            </button>
          </nav>
        </div>
        <div className="flex flex-1 justify-end gap-4 md:gap-6 items-center">
          <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-slate-800">
              <div className="text-[#4c739a] flex items-center justify-center pl-4">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input 
                className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:ring-0 text-[#0d141b] dark:text-white placeholder:text-[#4c739a] text-sm"
                placeholder="Search patients..."
              />
            </div>
          </label>
          <div className="flex items-center gap-3">
            <button 
              className="hidden md:flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold tracking-tight hover:bg-primary/90 transition-colors"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <span className={`material-symbols-outlined ${refreshing ? 'animate-spin' : ''} mr-1`}>
                {refreshing ? 'refresh' : 'publish'}
              </span>
              <span className="truncate">Publish Schedule</span>
            </button>
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-200 dark:border-slate-700 cursor-pointer"
              style={{ backgroundImage: `url(${doctorInfo.profileImage})` }}
              onClick={() => navigate('/doctor/profile')}
              title="Doctor Profile"
            />
          </div>
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="mx-4 md:mx-8 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex items-start">
            <span className="material-symbols-outlined mr-2">error</span>
            <div className="flex-1">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
            <button 
              onClick={fetchDoctorData}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-slate-700 dark:text-slate-300">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex w-96 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-col shrink-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col">
              <h1 className="text-[#0d141b] dark:text-white text-lg font-bold">{doctorInfo.name}</h1>
              <p className="text-[#4c739a] dark:text-slate-400 text-sm font-medium">
                {doctorInfo.specialty || 'Specialist'} • {doctorInfo.department}
              </p>
            </div>
          </div>
          
          {/* Appointment Requests Section */}
          <div className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-[#0d141b] dark:text-white text-sm font-bold uppercase tracking-wider">
                Appointment Requests
              </h2>
              {appointmentRequests.length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {appointmentRequests.length} New
                </span>
              )}
            </div>
            
            <div className="flex flex-col gap-3 px-4 pb-6">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : appointmentRequests.length === 0 ? (
                <div className="text-center py-4 text-slate-500 text-sm">
                  No pending requests
                </div>
              ) : (
                appointmentRequests.map((request) => (
                  <div key={request.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10 shrink-0"
                        style={{ backgroundImage: `url(${request.patient_image || 'https://via.placeholder.com/40'})` }}
                      />
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-bold truncate">{request.patient_name || `Request #${request.id}`}</p>
                        <p className="text-[10px] text-primary font-semibold uppercase tracking-tight">
                          Requested: {formatDate(request.created_at)}
                        </p>
                      </div>
                    </div>
                    <p className="text-[#4c739a] dark:text-slate-400 text-xs mb-4 line-clamp-2">
                      {request.symptoms || 'No symptoms provided'}
                    </p>
                    <div className="flex gap-2">
                      <button 
                        className="flex-1 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary/90 transition-colors"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        Accept
                      </button>
                      <button 
                        className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[#4c739a] dark:text-slate-400 text-[11px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => handleDeclineRequest(request.id)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Today's Queue Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2 className="text-[#0d141b] dark:text-white text-sm font-bold uppercase tracking-wider">
                Today's Queue
              </h2>
              {todaysAppointments.length > 0 && (
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {todaysAppointments.length} Assigned
                </span>
              )}
            </div>
            
            <div className="flex flex-col gap-1 px-3">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : todaysAppointments.length === 0 ? (
                <div className="text-center py-4 text-slate-500 text-sm">
                  No appointments today
                </div>
              ) : (
                todaysAppointments.map((appointment) => (
                  <div 
                    key={appointment.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                    onClick={() => openAppointmentDetails(appointment)}
                  >
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 shrink-0"
                      style={{ backgroundImage: `url(${appointment.patient_image || 'https://via.placeholder.com/48'})` }}
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-[#0d141b] dark:text-white text-sm font-semibold truncate">
                          {appointment.patient_name || `Patient #${appointment.patient_id}`}
                        </p>
                        <p className="text-primary text-[11px] font-bold">
                          {formatTime(appointment.start_time)}
                        </p>
                      </div>
                      <p className="text-[#4c739a] dark:text-slate-400 text-xs line-clamp-1">
                        {appointment.symptoms || 'No details provided'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex flex-col gap-1">
              <button 
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                onClick={() => navigate('/doctor/settings')}
              >
                <span className="material-symbols-outlined text-xl">settings</span>
                <p className="text-sm font-medium">Schedule Settings</p>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark">
          <div className="px-4 md:px-8 pt-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[#4c739a] mb-4">
              <button 
                className="hover:text-primary transition-colors"
                onClick={() => navigate('/doctor/dashboard')}
              >
                Home
              </button>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="text-[#0d141b] dark:text-white font-semibold">Schedule</span>
            </div>
            
            {/* Calendar Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-[#0d141b] dark:text-white">
                  {formatDate(weekDays[0]?.date)} – {formatDate(weekDays[6]?.date)}
                </h2>
                <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <button 
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#4c739a]"
                    onClick={() => changeWeek('prev')}
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button 
                    className="px-4 py-2 text-sm font-bold border-x border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => changeWeek('today')}
                  >
                    Today
                  </button>
                  <button 
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#4c739a]"
                    onClick={() => changeWeek('next')}
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <button 
                    className={`px-4 py-1.5 text-xs font-bold rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${viewMode === 'day' ? 'bg-primary text-white' : ''}`}
                    onClick={() => setViewMode('day')}
                  >
                    Day
                  </button>
                  <button 
                    className={`px-4 py-1.5 text-xs font-bold rounded-md ${viewMode === 'week' ? 'bg-primary text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    onClick={() => setViewMode('week')}
                  >
                    Week
                  </button>
                  <button 
                    className={`px-4 py-1.5 text-xs font-bold rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${viewMode === 'month' ? 'bg-primary text-white' : ''}`}
                    onClick={() => setViewMode('month')}
                  >
                    Month
                  </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-lg">filter_list</span>
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Statistics Cards */}
          <div className="px-4 md:px-8 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Appointments</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {statistics.totalAppointments}
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                      calendar_month
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Today's Appointments</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {statistics.todayAppointments}
                    </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                      today
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Upcoming (7 days)</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {statistics.upcomingAppointments}
                    </p>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">
                      upcoming
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Completion Rate</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {statistics.completionRate}%
                    </p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">
                      trending_up
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="flex-1 px-4 md:px-8 pb-8 overflow-hidden">
            <div className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
              {/* Calendar Header */}
              <div className="calendar-grid border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="h-12 border-r border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-400 text-lg">schedule</span>
                </div>
                {weekDays.map((day) => (
                  <div 
                    key={day.date}
                    className={`h-12 flex flex-col items-center justify-center border-r border-slate-200 dark:border-slate-800 ${
                      day.isToday ? 'bg-primary/5' : ''
                    } ${day.isWeekend ? 'bg-slate-100 dark:bg-slate-800/30' : ''}`}
                  >
                    <span className={`text-[10px] uppercase font-bold ${
                      day.isToday ? 'text-primary' : 'text-[#4c739a]'
                    } ${day.isWeekend ? 'opacity-50' : ''}`}>
                      {day.name}
                    </span>
                    <span className={`text-sm font-bold ${
                      day.isToday ? 'text-primary' : 'text-[#0d141b] dark:text-white'
                    } ${day.isWeekend ? 'opacity-50' : ''}`}>
                      {day.number}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Calendar Body */}
              <div className="flex-1 overflow-y-auto relative">
                <div className="flex flex-col">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : weeklySchedule.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-slate-500">
                      No schedule data available for this week
                    </div>
                  ) : (
                    weeklySchedule.map((timeSlot) => (
                      <div key={timeSlot.time} className="calendar-grid border-b border-slate-100 dark:border-slate-800/40 min-h-[80px]">
                        <div className="text-[11px] font-bold text-[#4c739a] text-center pt-2 border-r border-slate-200 dark:border-slate-800">
                          {timeSlot.time}
                        </div>
                        {timeSlot.days.map((day, dayIndex) => (
                          <div 
                            key={day.date}
                            className={`border-r border-slate-100 dark:border-slate-800/40 p-1 relative ${
                              isWeekend(day.date) ? 'bg-slate-100/30 dark:bg-slate-800/10' : ''
                            }`}
                          >
                            {day.appointments.map((appointment, appIndex) => (
                              <div 
                                key={appointment.id}
                                className="absolute inset-x-1 top-1 bottom-1 bg-primary/10 border-l-4 border-primary rounded-r p-2 flex flex-col overflow-hidden cursor-pointer hover:bg-primary/20 transition-colors"
                                onClick={() => openAppointmentDetails(appointment)}
                                style={{
                                  top: `${appIndex * 50}px`,
                                  height: 'calc(100% - 2px)'
                                }}
                              >
                                <span className="text-[10px] font-bold text-primary truncate">
                                  {appointment.patient_name}
                                </span>
                                {appointment.type && appointment.type !== 'patient' && (
                                  <span className="text-[9px] text-[#4c739a] truncate">
                                    {appointment.type}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-24 flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg z-10">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-primary"></div>
                    <span className="text-[10px] font-bold uppercase text-[#4c739a]">Patient</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-bold uppercase text-[#4c739a]">Personal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-full border-2 border-dashed border-primary/30 bg-primary/5"></div>
                    <span className="text-[10px] font-bold uppercase text-[#4c739a]">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Request Details Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Request Details</h2>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <span className="material-symbols-outlined text-slate-500">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                  style={{ backgroundImage: `url(${selectedRequest.patient_image || 'https://via.placeholder.com/48'})` }}
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{selectedRequest.patient_name || `Request #${selectedRequest.id}`}</h3>
                  <p className="text-sm text-slate-500">Requested: {formatDate(selectedRequest.created_at)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Symptoms:</h4>
                <p className="text-slate-600 dark:text-slate-400">{selectedRequest.symptoms || 'No symptoms provided'}</p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleAcceptRequest(selectedRequest.id)}
                  className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Accept Request
                </button>
                <button
                  onClick={() => handleDeclineRequest(selectedRequest.id)}
                  className="flex-1 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Appointment Details</h2>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <span className="material-symbols-outlined text-slate-500">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                  style={{ backgroundImage: `url(${selectedAppointment.patient_image || 'https://via.placeholder.com/48'})` }}
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{selectedAppointment.patient_name || `Patient #${selectedAppointment.patient_id}`}</h3>
                  <p className="text-sm text-slate-500">
                    {formatDate(selectedAppointment.start_time)} at {formatTime(selectedAppointment.start_time)}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Symptoms/Notes:</h4>
                <p className="text-slate-600 dark:text-slate-400">{selectedAppointment.symptoms || 'No details provided'}</p>
              </div>
              
              {selectedAppointment.department && (
                <div>
                  <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Department:</h4>
                  <p className="text-slate-600 dark:text-slate-400">{selectedAppointment.department}</p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleCompleteAppointment(selectedAppointment.id)}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => handleCancelAppointment(selectedAppointment.id)}
                  className="flex-1 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;