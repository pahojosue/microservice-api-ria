// src/utils/api.js
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const error = JSON.parse(text);
      errorMessage = error.detail || error.message || errorMessage;
    } catch {
      errorMessage = text || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
  
  // For DELETE requests that return no content
  if (response.status === 204) {
    return { success: true };
  }
  
  // For empty responses
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return { success: true };
  }
  
  return response.json();
};

// Helper for making API calls
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    method: options.method || 'GET',
    headers: getAuthHeaders(),
    ...options,
  };

  // Handle request body
  if (options.body && typeof options.body !== 'string') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// PATIENT API FUNCTIONS
export const patientApi = {
  // ========== APPOINTMENTS ==========
  // Get patient's appointments
  getAppointments: async (patientId, status = null) => {
    console.log('Fetching appointments for patient:', patientId, 'status:', status);
    
    let endpoint = `/patient/appointments?patient_id=${patientId}`;
    if (status && status !== 'all') {
      endpoint += `&status=${status}`;
    }
    
    return apiRequest(endpoint);
  },

  // Get appointment details
  getAppointmentDetails: async (appointmentId, patientId) => {
    return apiRequest(`/patient/appointments/${appointmentId}?patient_id=${patientId}`);
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId, patientId, reason = null) => {
    console.log('Cancelling appointment:', appointmentId, 'for patient:', patientId);
    
    let endpoint = `/patient/appointments/${appointmentId}/cancel?patient_id=${patientId}`;
    if (reason) {
      endpoint += `&reason=${encodeURIComponent(reason)}`;
    }
    
    return apiRequest(endpoint, { method: 'POST' });
  },

  // ========== PRE-REGISTRATION REQUESTS ==========
  // Create pre-registration request
  createRequest: async (patientId, data, patientEmail = '') => {
    console.log('Creating request for patient:', patientId, 'data:', data);
    
    let endpoint = `/patient/prereg/requests?patient_id=${patientId}`;
    if (patientEmail) {
      endpoint += `&patient_email=${encodeURIComponent(patientEmail)}`;
    }
    
    return apiRequest(endpoint, {
      method: 'POST',
      body: data,
    });
  },

  // Get patient's pre-registration requests
  getRequests: async (patientId, status = null) => {
    console.log('Fetching requests for patient:', patientId, 'status:', status);
    
    let endpoint = `/patient/prereg/requests?patient_id=${patientId}`;
    if (status && status !== 'all') {
      endpoint += `&status=${status}`;
    }
    
    return apiRequest(endpoint);
  },

  // Get request details
  getRequestDetails: async (requestId, patientId) => {
    return apiRequest(`/patient/prereg/requests/${requestId}?patient_id=${patientId}`);
  },

  // Update pre-registration request (PATIENT SIDE)
  updateRequest: async (requestId, patientId, data) => {
    console.log('Updating request:', requestId, 'for patient:', patientId, 'data:', data);
    
    return apiRequest(`/patient/prereg/requests/${requestId}?patient_id=${patientId}`, {
      method: 'PATCH',
      body: data,
    });
  },

  // Cancel pre-registration request
  cancelRequest: async (requestId, patientId) => {
    console.log('Cancelling request:', requestId, 'for patient:', patientId);
    
    return apiRequest(`/patient/prereg/requests/${requestId}/cancel?patient_id=${patientId}`, {
      method: 'POST',
    });
  },

  // Delete cancelled request
  deleteRequest: async (requestId, patientId) => {
    console.log('Deleting request:', requestId, 'for patient:', patientId);
    
    return apiRequest(`/patient/prereg/requests/${requestId}?patient_id=${patientId}`, {
      method: 'DELETE',
    });
  },

  // ========== PATIENT PROFILE ==========
  // Get patient profile
  getProfile: async (patientId) => {
    return apiRequest(`/patient/profile/${patientId}`);
  },

  // Update patient profile
  updateProfile: async (patientId, data) => {
    return apiRequest(`/patient/profile/${patientId}`, {
      method: 'PUT',
      body: data,
    });
  },

  // ========== OTHER PATIENT ENDPOINTS ==========
  // Reschedule appointment (if implemented)
  rescheduleAppointment: async (appointmentId, patientId, newDate, newTime) => {
    return apiRequest(`/patient/appointments/${appointmentId}/reschedule`, {
      method: 'POST',
      body: {
        patient_id: patientId,
        new_date: newDate,
        new_time: newTime,
      },
    });
  },

  // Mark appointment as completed (if implemented)
  completeAppointment: async (appointmentId, patientId, completionDetails) => {
    return apiRequest(`/patient/appointments/${appointmentId}/complete`, {
      method: 'POST',
      body: {
        patient_id: patientId,
        completion_details: completionDetails,
      },
    });
  },
};

// DOCTOR API FUNCTIONS
export const doctorApi = {
  // ========== DOCTOR INFORMATION ==========
  // Get doctor profile
  getDoctorProfile: async (doctorId) => {
    return apiRequest(`/doctor/profile/${doctorId}`);
  },

  // Update doctor profile
  updateDoctorProfile: async (doctorId, data) => {
    return apiRequest(`/doctor/profile/${doctorId}`, {
      method: 'PUT',
      body: data,
    });
  },

  // ========== PRE-REGISTRATION REQUESTS ==========
  // Get all pre-registration requests for doctor's department
  getRequests: async (doctorId, status = null, departmentId = null) => {
    let endpoint = `/doctor/prereg/requests?doctor_id=${doctorId}`;
    if (status) endpoint += `&status=${status}`;
    if (departmentId) endpoint += `&department_id=${departmentId}`;
    
    return apiRequest(endpoint);
  },

  // Accept a request and create appointment
  acceptRequest: async (requestId, doctorId) => {
    console.log('Accepting request:', requestId, 'by doctor:', doctorId);
    
    return apiRequest(`/doctor/prereg/requests/${requestId}/accept?doctor_id=${doctorId}`, {
      method: 'POST',
    });
  },

  // Decline a request
  declineRequest: async (requestId, doctorId, reason = '') => {
    let endpoint = `/doctor/prereg/requests/${requestId}/decline?doctor_id=${doctorId}`;
    if (reason) endpoint += `&reason=${encodeURIComponent(reason)}`;
    
    return apiRequest(endpoint, { method: 'POST' });
  },

  // Delete a request
  deleteRequest: async (requestId, doctorId) => {
    return apiRequest(`/doctor/prereg/requests/${requestId}?doctor_id=${doctorId}`, {
      method: 'DELETE',
    });
  },

  // ========== APPOINTMENTS ==========
  // Get doctor's appointments
  getAppointments: async (doctorId, status = null, startDate = null, endDate = null, includePast = false) => {
    let endpoint = `/doctor/appointments?doctor_id=${doctorId}`;
    if (status) endpoint += `&status=${status}`;
    if (startDate) endpoint += `&start_date=${startDate}`;
    if (endDate) endpoint += `&end_date=${endDate}`;
    if (includePast) endpoint += `&include_past=true`;
    
    return apiRequest(endpoint);
  },

  // Get appointment details
  getAppointmentDetails: async (appointmentId, doctorId) => {
    return apiRequest(`/doctor/appointments/${appointmentId}?doctor_id=${doctorId}`);
  },

  // Get full appointment details with patient info
  getAppointmentDetailsFull: async (appointmentId, doctorId) => {
    return apiRequest(`/doctor/appointments/${appointmentId}/details?doctor_id=${doctorId}`);
  },

  // Complete an appointment
  completeAppointment: async (appointmentId, doctorId) => {
    return apiRequest(`/doctor/appointments/${appointmentId}/complete?doctor_id=${doctorId}`, {
      method: 'POST',
    });
  },

  // Cancel an appointment (doctor side)
  cancelAppointment: async (appointmentId, doctorId, reason = '') => {
    let endpoint = `/doctor/appointments/${appointmentId}/cancel?doctor_id=${doctorId}`;
    if (reason) endpoint += `&reason=${encodeURIComponent(reason)}`;
    
    return apiRequest(endpoint, { method: 'POST' });
  },

  // Reschedule appointment (if implemented)
  rescheduleAppointment: async (appointmentId, doctorId, newDate, newTime) => {
    return apiRequest(`/doctor/appointments/${appointmentId}/reschedule`, {
      method: 'POST',
      body: {
        doctor_id: doctorId,
        new_date: newDate,
        new_time: newTime,
      },
    });
  },

  // ========== STATISTICS & ANALYTICS ==========
  // Get appointment statistics
  getAppointmentStatistics: async (doctorId) => {
    return apiRequest(`/doctor/appointments/statistics?doctor_id=${doctorId}`);
  },

  // ========== AVAILABILITY & SCHEDULE ==========
  // Get doctor's availability
  getAvailability: async (doctorId, date = null) => {
    let endpoint = `/doctor/availability?doctor_id=${doctorId}`;
    if (date) endpoint += `&date=${date}`;
    
    return apiRequest(endpoint);
  },

  // Update doctor's availability
  updateAvailability: async (doctorId, data) => {
    return apiRequest(`/doctor/availability?doctor_id=${doctorId}`, {
      method: 'PUT',
      body: data,
    });
  },

  // Publish schedule
  publishSchedule: async (doctorId, scheduleData) => {
    return apiRequest(`/doctor/schedule/publish?doctor_id=${doctorId}`, {
      method: 'POST',
      body: scheduleData,
    });
  },

  // ========== PATIENT MANAGEMENT ==========
  // Get doctor's patients
  getPatients: async (doctorId, search = '', page = 1, limit = 20) => {
    let endpoint = `/doctor/patients?doctor_id=${doctorId}&page=${page}&limit=${limit}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    
    return apiRequest(endpoint);
  },

  // Get patient details
  getPatientDetails: async (doctorId, patientId) => {
    return apiRequest(`/doctor/patients/${patientId}?doctor_id=${doctorId}`);
  },

  // Get patient's medical history
  getPatientMedicalHistory: async (doctorId, patientId) => {
    return apiRequest(`/doctor/patients/${patientId}/medical-history?doctor_id=${doctorId}`);
  },
};

// COMMON/AUTH API FUNCTIONS
export const authApi = {
  // Login
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(response);
    
    // Store token if provided
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    // Store user info
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.id) {
        if (data.user.role === 'patient') {
          localStorage.setItem('patientId', data.user.id);
        } else if (data.user.role === 'doctor') {
          localStorage.setItem('doctorId', data.user.id);
        }
      }
    }
    
    return data;
  },

  // Register
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);
    
    // Store token if provided
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('patientId');
    localStorage.removeItem('doctorId');
  },

  // Get current user
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  // Verify token
  verifyToken: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    return handleResponse(response);
  },
};

// DEPARTMENT API FUNCTIONS (if needed)
export const departmentApi = {
  // Get all departments
  getDepartments: async () => {
    return apiRequest('/departments');
  },

  // Get department by ID
  getDepartment: async (departmentId) => {
    return apiRequest(`/departments/${departmentId}`);
  },

  // Get department doctors
  getDepartmentDoctors: async (departmentId) => {
    return apiRequest(`/departments/${departmentId}/doctors`);
  },
};

// UTILITY FUNCTIONS
export const utils = {
  // Format date to YYYY-MM-DD
  formatDate: (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  },

  // Format time to HH:MM
  formatTime: (date) => {
    const d = new Date(date);
    return d.toTimeString().split(' ')[0].substring(0, 5);
  },

  // Get readable status
  getStatusText: (status) => {
    const statusMap = {
      'pending': 'Pending',
      'accepted': 'Accepted',
      'scheduled': 'Scheduled',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'declined': 'Declined',
    };
    return statusMap[status] || status;
  },

  // Get status color
  getStatusColor: (status) => {
    const colorMap = {
      'pending': 'amber',
      'accepted': 'blue',
      'scheduled': 'green',
      'completed': 'gray',
      'cancelled': 'red',
      'declined': 'red',
    };
    return colorMap[status] || 'gray';
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get user role
  getUserRole: () => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
      const userData = JSON.parse(user);
      return userData.role;
    } catch {
      return null;
    }
  },

  // Get user ID based on role
  getUserId: () => {
    const role = utils.getUserRole();
    if (role === 'patient') {
      return parseInt(localStorage.getItem('patientId') || '1');
    } else if (role === 'doctor') {
      return parseInt(localStorage.getItem('doctorId') || '1');
    }
    return null;
  },
};

// Export everything
export default {
  patientApi,
  doctorApi,
  authApi,
  departmentApi,
  utils,
  API_BASE_URL,
};