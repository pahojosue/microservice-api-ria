import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { patientApi } from '../../services/preregService';

function AppointmentList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('scheduled');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [completionReason, setCompletionReason] = useState('');

  // Get patient ID from auth
  const patientId = parseInt(localStorage.getItem('patientId') || '1');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Map tab selection to API status
      const getStatusForTab = (tab) => {
        switch(tab) {
          case 'scheduled': return null; // Get all appointments
          case 'pending': return 'pending';
          case 'past': return 'completed';
          default: return null;
        }
      };

      const status = getStatusForTab(selectedTab);
      
      // Fetch both appointments and requests
      const [appointmentsData, requestsData] = await Promise.all([
        patientApi.getAppointments(patientId, status),
        patientApi.getRequests(patientId, status)
      ]);

      // Format appointments
      const formattedAppointments = Array.isArray(appointmentsData) ? appointmentsData.map(app => ({
        id: app.id,
        type: 'appointment',
        date: app.start_time ? app.start_time.split('T')[0] : app.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        time: app.start_time 
          ? `${new Date(app.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
          : 'Time not set',
        end_time: app.end_time 
          ? `${new Date(app.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
          : null,
        doctor: app.doctor_name || 'Pending Assignment',
        department: app.department_name || 'General Practice',
        symptoms: app.symptoms || 'No symptoms provided',
        status: app.status?.toLowerCase() || 'pending',
        iconColor: app.doctor_name ? 'blue' : 'gray',
        rawData: app,
        created_at: app.created_at,
        reason: app.reason || '',
        decline_reason: app.decline_reason || ''
      })) : [];

      // Format requests
      const formattedRequests = Array.isArray(requestsData) ? requestsData.map(req => ({
        id: req.id,
        type: 'request',
        date: req.preferred_date || req.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        time: req.assigned_slot ? `${req.assigned_slot.start || 'Time'}` : 'Time to be assigned',
        doctor: req.assigned_doctor_name || 'Pending Assignment',
        department: req.department || 'General Practice',
        symptoms: req.symptoms || 'No symptoms provided',
        status: req.status?.toLowerCase() || 'pending',
        iconColor: req.assigned_doctor_name ? 'blue' : 'gray',
        rawData: req,
        created_at: req.created_at,
        preferred_date: req.preferred_date,
        decline_reason: req.decline_reason || '',
        additional_notes: req.additional_notes || ''
      })) : [];

      // Combine and sort by date (newest first)
      const allItems = [...formattedAppointments, ...formattedRequests].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      setItems(allItems);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load appointments and requests. Please try again.');
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  // Modal Functions
  const openModal = (item) => {
    setSelectedItem(item);
    setUpdateData({
      preferred_date: item.type === 'request' ? item.preferred_date : item.date,
      additional_notes: item.additional_notes || ''
    });
    setShowModal(true);
    setShowUpdateForm(false);
    setCompletionReason('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setShowUpdateForm(false);
    setModalLoading(false);
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;

    setModalLoading(true);
    try {
      if (selectedItem.type === 'request') {
        // Update request - ONLY preferred_date is allowed
        const updatePayload = {
          preferred_date: updateData.preferred_date
        };
        
        // Remove empty fields to avoid validation errors
        Object.keys(updatePayload).forEach(key => {
          if (updatePayload[key] === undefined || updatePayload[key] === '') {
            delete updatePayload[key];
          }
        });
        
        await patientApi.updateRequest(
          selectedItem.id,
          patientId,
          updatePayload
        );
      } else {
        // For appointments, show message
        alert('To update appointment details, please contact the hospital directly or reschedule the appointment.');
      }
      
      alert('Update submitted successfully!');
      setShowUpdateForm(false);
      fetchData(); // Refresh data
      closeModal();
    } catch (err) {
      console.error('Error updating:', err);
      alert(`Failed to update: ${err.message || 'Please check the date format and try again.'}`);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCancelItem = async (item) => {
    if (!window.confirm(`Are you sure you want to cancel this ${item.type}?`)) {
      return;
    }

    try {
      if (item.type === 'appointment') {
        await patientApi.cancelAppointment(item.id, patientId, 'Cancelled by patient');
      } else {
        await patientApi.cancelRequest(item.id, patientId);
      }
      
      alert(`${item.type === 'appointment' ? 'Appointment' : 'Request'} cancelled successfully`);
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error cancelling:', err);
      alert(`Failed to cancel ${item.type}: ${err.message}`);
    }
  };

  const handleDeleteItem = async (itemId, itemType) => {
    if (!window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
      return;
    }

    try {
      if (itemType === 'request') {
        await patientApi.deleteRequest(itemId, patientId);
      } else {
        // For appointments, you might need a different endpoint
        alert('Appointment deletion might require contacting the hospital directly.');
        return;
      }
      
      alert(`${itemType === 'appointment' ? 'Appointment' : 'Request'} deleted successfully`);
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error deleting:', err);
      alert(`Failed to delete ${itemType}: ${err.message}`);
    }
  };

  const handleMarkAsComplete = async () => {
    if (!selectedItem || !completionReason.trim()) {
      alert('Please provide a completion reason');
      return;
    }

    setModalLoading(true);
    try {
      if (selectedItem.type === 'appointment') {
        // Mark appointment as completed
        await patientApi.completeAppointment(selectedItem.id, patientId, {
          completion_notes: completionReason
        });
      } else {
        // Mark request as completed
        alert('Requests are typically marked complete by the hospital. Please contact them if you need to update the status.');
      }
      
      alert('Completion status updated!');
      setCompletionReason('');
      fetchData();
      closeModal();
    } catch (err) {
      console.error('Error marking as complete:', err);
      alert(`Failed to mark as complete: ${err.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        label: 'Pending',
        icon: 'pending'
      },
      accepted: { 
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        label: 'Accepted',
        icon: 'check_circle'
      },
      scheduled: { 
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        label: 'Scheduled',
        icon: 'event'
      },
      completed: { 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        label: 'Completed',
        icon: 'done_all'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        label: 'Cancelled',
        icon: 'cancel'
      },
      declined: { 
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        label: 'Declined',
        icon: 'block'
      }
    };
    
    return statusConfig[status] || { 
      color: 'bg-gray-100 text-gray-800', 
      label: status,
      icon: 'help'
    };
  };

  const getIconColor = (item) => {
    if (item.status === 'cancelled' || item.status === 'declined') {
      return 'bg-red-100 text-red-600';
    }
    return item.iconColor === 'blue' 
      ? 'bg-blue-100 text-primary' 
      : 'bg-slate-100 dark:bg-slate-700 text-slate-400';
  };

  // Check if item is modifiable based on status
  const isModifiable = (item) => {
    const modifiableStatuses = ['pending', 'accepted', 'scheduled', 'completed'];
    return modifiableStatuses.includes(item.status);
  };

  // Check if item can be updated (only for requests with pending/accepted status)
  const canBeUpdated = (item) => {
    return item.type === 'request' && ['pending', 'accepted'].includes(item.status);
  };

  // Filter items for current tab
  const filteredItems = items.filter(item => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'scheduled') return ['scheduled', 'accepted'].includes(item.status);
    if (selectedTab === 'pending') return item.status === 'pending';
    if (selectedTab === 'past') return ['completed', 'cancelled', 'declined'].includes(item.status);
    return true;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Calculate counts for tabs
  const tabCounts = {
    all: items.length,
    scheduled: items.filter(item => ['scheduled', 'accepted'].includes(item.status)).length,
    pending: items.filter(item => item.status === 'pending').length,
    past: items.filter(item => ['completed', 'cancelled', 'declined'].includes(item.status)).length
  };

  const tabs = [
    { id: 'scheduled', label: `Scheduled (${tabCounts.scheduled})`, icon: 'event' },
    { id: 'pending', label: `Pending (${tabCounts.pending})`, icon: 'pending' },
    { id: 'past', label: `Past (${tabCounts.past})`, icon: 'history' },
    { id: 'all', label: `All (${tabCounts.all})`, icon: 'list' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
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

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'Not scheduled';
    try {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return timeString ? `${formattedDate} at ${timeString}` : formattedDate;
    } catch (err) {
      return dateString;
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">
            My Appointments & Requests
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage your upcoming visits, pending requests, and medical history.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Patient ID: {patientId}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center rounded-lg h-12 px-6 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-200 transition-colors gap-2"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <span className={`material-symbols-outlined ${refreshing ? 'animate-spin' : ''}`}>
              {refreshing ? 'refresh' : 'refresh'}
            </span>
            Refresh
          </button>
          <button
            className="flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-wide shadow-md hover:bg-primary/90 transition-all gap-2"
            onClick={() => navigate('/create-appointment')}
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span className="truncate">New Appointment</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <div className="flex items-start">
            <span className="material-symbols-outlined mr-2">error</span>
            <div className="flex-1">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
            <button 
              onClick={fetchData}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
        <div className="px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-4 md:gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center justify-center border-b-[3px] pb-4 pt-5 transition-colors ${
                  selectedTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-b-transparent text-slate-500 dark:text-slate-400 hover:text-primary'
                }`}
                onClick={() => {
                  setSelectedTab(tab.id);
                  setCurrentPage(1);
                }}
              >
                <span className="material-symbols-outlined mr-2 text-sm">{tab.icon}</span>
                <p className="text-sm font-bold leading-normal tracking-wide whitespace-nowrap">
                  {tab.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Items Table */}
        <div className="px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <span className="text-slate-600">Loading appointments...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">calendar_month</span>
              <h3 className="text-slate-500 text-lg font-medium">No appointments found</h3>
              <p className="text-slate-400 text-sm mt-2 mb-4">
                {selectedTab === 'scheduled' 
                  ? "You don't have any scheduled appointments." 
                  : selectedTab === 'pending'
                  ? "You don't have any pending requests."
                  : selectedTab === 'past'
                  ? "You don't have any past appointments."
                  : "You don't have any appointments or requests yet."}
              </p>
              <button 
                onClick={() => navigate('/create-appointment')}
                className="inline-flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all gap-2"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Create New Appointment
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                        Physician / Dept
                      </th>
                      <th className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider hidden lg:table-cell">
                        Symptoms
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
                    {currentItems.map((item) => {
                      const statusConfig = getStatusBadge(item.status);
                      
                      return (
                        <tr
                          key={`${item.type}-${item.id}`}
                          className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="px-4 py-6">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              item.type === 'appointment' 
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              <span className="material-symbols-outlined text-xs mr-1">
                                {item.type === 'appointment' ? 'event' : 'pending_actions'}
                              </span>
                              {item.type === 'appointment' ? 'Appointment' : 'Request'}
                            </div>
                          </td>
                          <td className="px-4 py-6">
                            <div className="flex flex-col">
                              <span className="text-slate-900 dark:text-white font-semibold">
                                {formatDate(item.date)}
                              </span>
                              <span className="text-slate-500 dark:text-slate-400 text-sm">
                                {item.time}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-6">
                            <div className="flex items-center gap-3">
                              <div className={`size-8 rounded-full flex items-center justify-center ${getIconColor(item)}`}>
                                <span className="material-symbols-outlined text-lg">
                                  {item.doctor === 'Pending Assignment' 
                                    ? 'question_mark' 
                                    : 'medical_services'}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-slate-900 dark:text-white font-medium">
                                  {item.doctor}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 text-xs">
                                  {item.department}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-6 hidden lg:table-cell">
                            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-[250px] truncate" title={item.symptoms}>
                              {item.symptoms}
                            </p>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                              <span className="material-symbols-outlined text-xs mr-1">
                                {statusConfig.icon}
                              </span>
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-4 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="View Details"
                                onClick={() => openModal(item)}
                              >
                                <span className="material-symbols-outlined">visibility</span>
                              </button>
                              
                              {/* Only show update button for requests that can be updated */}
                              {canBeUpdated(item) && (
                                <button
                                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                  title="Update"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setUpdateData({
                                      preferred_date: item.preferred_date || item.date,
                                      additional_notes: item.additional_notes || ''
                                    });
                                    setShowUpdateForm(true);
                                    setShowModal(true);
                                  }}
                                >
                                  <span className="material-symbols-outlined">edit</span>
                                </button>
                              )}
                              
                              {/* Show cancel button for modifiable items */}
                              {isModifiable(item) && !['completed'].includes(item.status) && (
                                <button
                                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title={`Cancel ${item.type}`}
                                  onClick={() => handleCancelItem(item)}
                                >
                                  <span className="material-symbols-outlined">cancel</span>
                                </button>
                              )}
                              
                              {/* Show complete button for scheduled appointments */}
                              {item.status === 'scheduled' && item.type === 'appointment' && (
                                <button
                                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                  title="Mark as Complete"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setShowModal(true);
                                  }}
                                >
                                  <span className="material-symbols-outlined">check_circle</span>
                                </button>
                              )}
                              
                              {/* Show reschedule button for scheduled items */}
                              {item.status === 'scheduled' && (
                                <button
                                  className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                  title="Reschedule"
                                  onClick={() => navigate(`/reschedule/${item.type}/${item.id}`)}
                                >
                                  <span className="material-symbols-outlined">calendar_month</span>
                                </button>
                              )}
                              
                              {/* Show delete button for cancelled/declined items */}
                              {['cancelled', 'declined'].includes(item.status) && (
                                <button
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Delete"
                                  onClick={() => handleDeleteItem(item.id, item.type)}
                                >
                                  <span className="material-symbols-outlined">delete</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 sm:mb-0">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      className="flex size-9 items-center justify-center text-slate-400 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          className={`text-sm font-medium flex size-9 items-center justify-center rounded-lg ${
                            currentPage === pageNum
                              ? 'text-white bg-primary shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      className="flex size-9 items-center justify-center text-slate-400 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail/Update Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-full flex items-center justify-center ${
                  selectedItem.type === 'appointment' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  <span className="material-symbols-outlined">
                    {selectedItem.type === 'appointment' ? 'event' : 'pending_actions'}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedItem.type === 'appointment' ? 'Appointment Details' : 'Request Details'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    ID: {selectedItem.id} • Created: {formatDate(selectedItem.created_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {showUpdateForm ? (
                // Update Form - ONLY for requests
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">edit</span>
                    Update Request
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Note: You can only update the preferred date for pending requests.
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                      value={updateData.preferred_date}
                      onChange={(e) => setUpdateData({...updateData, preferred_date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Choose your preferred date for the appointment
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setShowUpdateForm(false)}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateItem}
                      disabled={modalLoading || !updateData.preferred_date}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {modalLoading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">refresh</span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">save</span>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : selectedItem.status === 'scheduled' && selectedItem.type === 'appointment' ? (
                // Completion Form for scheduled appointments
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">check_circle</span>
                    Mark Appointment as Complete
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Completion Details
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                      rows="4"
                      value={completionReason}
                      onChange={(e) => setCompletionReason(e.target.value)}
                      placeholder="Please provide details about the appointment completion (treatment received, follow-up needed, etc.)"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleMarkAsComplete}
                      disabled={modalLoading || !completionReason.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {modalLoading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">refresh</span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">check_circle</span>
                          Mark as Complete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                // Details View
                <>
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedItem.status).color}`}>
                      <span className="material-symbols-outlined text-sm mr-1">
                        {getStatusBadge(selectedItem.status).icon}
                      </span>
                      {getStatusBadge(selectedItem.status).label}
                    </span>
                    
                    <div className="text-sm text-slate-500">
                      {selectedItem.type === 'appointment' ? 'Appointment' : 'Request'}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">schedule</span>
                        Date & Time
                      </h4>
                      <p className="text-slate-900 dark:text-white font-medium">
                        {formatDateTime(selectedItem.date, selectedItem.time)}
                      </p>
                      {selectedItem.end_time && (
                        <p className="text-sm text-slate-500 mt-1">
                          End: {selectedItem.end_time}
                        </p>
                      )}
                      {selectedItem.type === 'request' && selectedItem.preferred_date && (
                        <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                          Preferred Date: {formatDate(selectedItem.preferred_date)}
                        </p>
                      )}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">person</span>
                        Physician & Department
                      </h4>
                      <p className="text-slate-900 dark:text-white font-medium">
                        {selectedItem.doctor}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        {selectedItem.department}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg md:col-span-2">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">stethoscope</span>
                        Symptoms / Reason
                      </h4>
                      <p className="text-slate-900 dark:text-white">
                        {selectedItem.symptoms}
                      </p>
                    </div>

                    {selectedItem.decline_reason && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg md:col-span-2">
                        <h4 className="text-sm font-medium text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                          <span className="material-symbols-outlined">warning</span>
                          Cancellation/Decline Reason
                        </h4>
                        <p className="text-red-800 dark:text-red-300">
                          {selectedItem.decline_reason}
                        </p>
                      </div>
                    )}

                    {selectedItem.additional_notes && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg md:col-span-2">
                        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                          <span className="material-symbols-outlined">notes</span>
                          Additional Notes
                        </h4>
                        <p className="text-blue-800 dark:text-blue-300">
                          {selectedItem.additional_notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                    {/* Update button only for pending/accepted requests */}
                    {canBeUpdated(selectedItem) && (
                      <button
                        onClick={() => setShowUpdateForm(true)}
                        className="flex-1 min-w-[120px] px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">edit</span>
                        Update Date
                      </button>
                    )}
                    
                    {/* Cancel button for modifiable items except completed */}
                    {isModifiable(selectedItem) && !['completed'].includes(selectedItem.status) && (
                      <button
                        onClick={() => handleCancelItem(selectedItem)}
                        className="flex-1 min-w-[120px] px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">cancel</span>
                        Cancel
                      </button>
                    )}
                    
                    {/* Reschedule for scheduled items */}
                    {selectedItem.status === 'scheduled' && (
                      <button
                        onClick={() => navigate(`/reschedule/${selectedItem.type}/${selectedItem.id}`)}
                        className="flex-1 min-w-[120px] px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">calendar_month</span>
                        Reschedule
                      </button>
                    )}
                    
                    {/* Complete button for scheduled appointments */}
                    {selectedItem.status === 'scheduled' && selectedItem.type === 'appointment' && (
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setTimeout(() => {
                            setSelectedItem(selectedItem);
                            setShowModal(true);
                          }, 100);
                        }}
                        className="flex-1 min-w-[120px] px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">check_circle</span>
                        Mark Complete
                      </button>
                    )}
                    
                    {/* Delete for cancelled/declined items */}
                    {['cancelled', 'declined'].includes(selectedItem.status) && (
                      <button
                        onClick={() => handleDeleteItem(selectedItem.id, selectedItem.type)}
                        className="flex-1 min-w-[120px] px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">delete</span>
                        Delete
                      </button>
                    )}
                    
                    <button
                      onClick={closeModal}
                      className="flex-1 min-w-[120px] px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default AppointmentList;