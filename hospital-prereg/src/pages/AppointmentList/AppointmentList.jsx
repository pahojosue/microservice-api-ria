// src/pages/AppointmentList/AppointmentList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import { Link } from 'react-router-dom';

function AppointmentList() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState('accepted');

  // Mock data - Replace with API call
  const mockAppointments = [
    {
      id: 1,
      date: '2023-10-24',
      time: '10:00 AM - 10:45 AM',
      doctor: 'Dr. Emily Smith',
      department: 'Cardiology Department',
      symptoms: 'Shortness of breath, chest pressure during exercise',
      status: 'accepted',
      iconColor: 'blue'
    },
    {
      id: 2,
      date: '2023-10-30',
      time: '02:30 PM - 03:00 PM',
      doctor: 'Dr. Marc Garcia',
      department: 'Dermatology',
      symptoms: 'Skin irritation on forearm, persists for 2 weeks',
      status: 'accepted',
      iconColor: 'purple'
    },
    {
      id: 3,
      date: '2023-11-05',
      time: 'Morning (Preferred)',
      doctor: 'Pending Assignment',
      department: 'General Practice',
      symptoms: 'Annual wellness checkup and lab work',
      status: 'pending',
      iconColor: 'gray'
    },
    {
      id: 4,
      date: '2023-11-12',
      time: '09:15 AM - 09:45 AM',
      doctor: 'Dr. Lisa Wong',
      department: 'Internal Medicine',
      symptoms: 'Follow-up on blood pressure medication',
      status: 'accepted',
      iconColor: 'blue'
    }
  ];



  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Replace with actual API call
      // const response = await fetch('http://localhost:5000/api/appointments');
      // const data = await response.json();
      
      // For now, use mock data
      setTimeout(() => {
        setAppointments(mockAppointments);
        setLoading(false);
      }, 500);

    } catch (err) {
      setError('Failed to load appointments');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter(app => 
    selectedTab === 'accepted' ? app.status === 'accepted' : 
    selectedTab === 'pending' ? app.status === 'pending' : 
    true
  );

  const handleCancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        // Replace with actual API call
        // await fetch(`http://localhost:5000/api/appointments/${id}`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        
        setAppointments(appointments.filter(app => app.id !== id));
        alert('Appointment cancelled successfully');
      } catch (err) {
        console.log(err);
        alert('Failed to cancel appointment');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getIconColor = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-primary';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-400';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const tabs = [
    { id: 'pending', label: 'Pending (2)', count: 2 },
    { id: 'accepted', label: 'Accepted (4)', count: 4 },
    { id: 'past', label: 'Past', count: 6 }
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex-1 flex justify-center py-8">
          <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-4 md:px-10 gap-6">
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">
                  My Appointments
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Manage your upcoming visits and view medical history.
                </p>
              </div>
              <button
                className="flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-wide shadow-md hover:bg-primary/90 transition-all gap-2"
                onClick={() => navigate('/create-appointment')}
              >
                <span className="material-symbols-outlined">add_circle</span>
                <span className="truncate">Book New Appointment</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col">
              <div className="px-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex gap-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex flex-col items-center justify-center border-b-[3px] pb-4 pt-5 transition-colors ${
                        selectedTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-b-transparent text-slate-500 dark:text-slate-400 hover:text-primary'
                      }`}
                      onClick={() => setSelectedTab(tab.id)}
                    >
                      <p className="text-sm font-bold leading-normal tracking-wide">{tab.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Appointments Table */}
              <div className="px-6 py-4">
                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-10 text-red-500">{error}</div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    No appointments found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                          <th className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                            Physician / Dept
                          </th>
                          <th className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider hidden md:table-cell">
                            Symptoms Reported
                          </th>
                          <th className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider text-center">
                            Status
                          </th>
                          <th className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredAppointments.map((appointment) => (
                          <tr
                            key={appointment.id}
                            className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="px-4 py-6">
                              <div className="flex flex-col">
                                <span className="text-slate-900 dark:text-white font-semibold">
                                  {new Date(appointment.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 text-sm">
                                  {appointment.time}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-6">
                              <div className="flex items-center gap-3">
                                <div className={`size-8 rounded-full flex items-center justify-center ${getIconColor(appointment.iconColor)}`}>
                                  <span className="material-symbols-outlined text-lg">
                                    {appointment.doctor === 'Pending Assignment' 
                                      ? 'question_mark' 
                                      : 'medical_services'}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-slate-900 dark:text-white font-medium">
                                    {appointment.doctor}
                                  </span>
                                  <span className="text-slate-500 dark:text-slate-400 text-xs">
                                    {appointment.department}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-6 hidden md:table-cell">
                              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-[250px] truncate">
                                {appointment.symptoms}
                              </p>
                            </td>
                            <td className="px-4 py-6 text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                                {getStatusText(appointment.status)}
                              </span>
                            </td>
                            <td className="px-4 py-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                  title="View Details"
                                  onClick={() => navigate(`/appointment/${appointment.id}`)}
                                >
                                  <span className="material-symbols-outlined">visibility</span>
                                </button>
                                {appointment.status === 'pending' ? (
                                  <button
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Cancel Request"
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                  >
                                    <span className="material-symbols-outlined">cancel</span>
                                  </button>
                                ) : (
                                  <button
                                    className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    title="Reschedule"
                                  >
                                    <span className="material-symbols-outlined">calendar_month</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Showing 1 to {filteredAppointments.length} of {appointments.length} appointments
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <button className="flex size-9 items-center justify-center text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>
                    <button className="text-sm font-bold flex size-9 items-center justify-center text-white rounded-lg bg-primary shadow-sm">
                      1
                    </button>
                    <button className="text-sm font-medium flex size-9 items-center justify-center text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      2
                    </button>
                    <button className="text-sm font-medium flex size-9 items-center justify-center text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      3
                    </button>
                    <button className="flex size-9 items-center justify-center text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <footer className="py-10 text-center text-slate-400 text-sm border-t border-slate-200/50 dark:border-slate-800/50">
          © {new Date().getFullYear()} HealthCare Portal. Secure Patient Gateway.
        </footer>
      </div>
    </div>
  );
}

export default AppointmentList;