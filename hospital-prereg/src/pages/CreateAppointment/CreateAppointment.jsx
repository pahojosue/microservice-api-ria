// src/pages/CreateAppointment/CreateAppointment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { patientApi } from '../../services/preregService';

function CreateAppointment() {
  const navigate = useNavigate();
  const [symptomsTags, setSymptomsTags] = useState([]);
  const [additionalSymptoms, setAdditionalSymptoms] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formValid, setFormValid] = useState(false);

  // Calendar data
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);

  // Get patient ID from auth context or localStorage
  const patientId = parseInt(localStorage.getItem('patientId') || '1');
  const patientEmail = localStorage.getItem('patientEmail') || '';

  useEffect(() => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    
    generateCalendarDays();
  }, [currentMonth]);

  // Validate form whenever inputs change
  useEffect(() => {
    const hasSymptoms = symptomsTags.length > 0 || additionalSymptoms.trim().length > 0;
    const hasDate = selectedDate !== '';
    const isFutureDate = selectedDate ? new Date(selectedDate) > new Date() : false;
    
    setFormValid(hasSymptoms && hasDate && isFutureDate);
  }, [symptomsTags, additionalSymptoms, selectedDate]);

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    for (let i = firstDayOfWeek; i > 0; i--) {
      days.push({
        day: prevMonthLastDay - i + 1,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i + 1)
      });
    }

    // Current month days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      
      days.push({
        day: i,
        isCurrentMonth: true,
        date,
        isSelected: dateString === selectedDate,
        isPast: date < today
      });
    }

    setDaysInMonth(days);
  };

  const handleAddSymptom = (input) => {
    const value = input.value.trim();
    if (value && !symptomsTags.includes(value)) {
      setSymptomsTags([...symptomsTags, value]);
      input.value = '';
    }
  };

  const handleRemoveSymptom = (index) => {
    const newSymptoms = [...symptomsTags];
    newSymptoms.splice(index, 1);
    setSymptomsTags(newSymptoms);
  };

  const handleDateSelect = (day) => {
    if (day.isCurrentMonth && !day.isPast) {
      const dateString = day.date.toISOString().split('T')[0];
      setSelectedDate(dateString);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formValid) {
      setError('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Combine tags and additional symptoms
      const allSymptoms = [
        ...symptomsTags,
        ...(additionalSymptoms.trim() ? [additionalSymptoms.trim()] : [])
      ].join(', ');

      if (!allSymptoms.trim()) {
        throw new Error('Please describe your symptoms');
      }

      if (!selectedDate) {
        throw new Error('Please select a date');
      }

      const requestData = {
        symptoms: allSymptoms,
        preferred_date: selectedDate
      };

      console.log('Submitting request for patient:', patientId, 'Data:', requestData);

      const response = await patientApi.createRequest(patientId, requestData, patientEmail);
      
      console.log('Response received:', response);
      
      setSuccess('Pre-registration request submitted successfully! The system will automatically assign a doctor based on availability.');
      
      // Clear form
      setSymptomsTags([]);
      setAdditionalSymptoms('');
      
      // Redirect to appointments page after 3 seconds
      setTimeout(() => {
        navigate('/appointments');
      }, 3000);

    } catch (err) {
      console.error('Appointment creation error:', err);
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    const allSymptoms = [
      ...symptomsTags,
      ...(additionalSymptoms.trim() ? [additionalSymptoms.trim()] : [])
    ].join(', ');

    const draftData = {
      symptoms: allSymptoms,
      date: selectedDate,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('appointmentDraft', JSON.stringify(draftData));
    
    // Show success message
    setSuccess('Draft saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  return (
    <Layout>
      {/* Error and Success Messages */}
      {error && (
        <div className="fixed top-20 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex items-start">
            <span className="material-symbols-outlined mr-2">error</span>
            <div>
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-1">{error}</span>
            </div>
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}
      
      {success && (
        <div className="fixed top-20 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex items-start">
            <span className="material-symbols-outlined mr-2">check_circle</span>
            <div>
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline ml-1">{success}</span>
            </div>
            <button 
              onClick={() => setSuccess('')}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            New Appointment Pre-registration
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
            Complete the form below to streamline your check-in process. Tell us about your symptoms and choose a date.
          </p>
          <p className="text-sm text-primary mt-2">
            <span className="material-symbols-outlined text-sm mr-1">info</span>
            Doctors are automatically assigned based on symptoms and availability
          </p>
        </div>
        <button 
          type="button"
          className="flex items-center justify-center rounded-lg h-10 px-6 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-200 transition-colors"
          onClick={() => navigate('/appointments')}
        >
          <span className="material-symbols-outlined text-sm mr-2">history</span>
          View History
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Section 1: Symptoms */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">stethoscope</span>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold">1. Describe Your Symptoms *</h2>
          </div>
          <p className="text-slate-500 text-sm mb-4">Type your symptoms and press enter to add them as tags, or describe in detail below.</p>
          
          <div className="tag-input-container flex flex-wrap items-center gap-2 p-3 min-h-[56px] w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 transition-all mb-4">
            {symptomsTags.map((symptom, index) => (
              <div key={index} className="flex items-center gap-1.5 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                {symptom}
                <button 
                  type="button"
                  className="hover:text-red-200 flex items-center ml-1"
                  onClick={() => handleRemoveSymptom(index)}
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
            ))}
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSymptom(e.target);
                }
              }}
              className="flex-1 bg-transparent border-none focus:ring-0 min-w-[120px] text-sm py-1 placeholder:text-slate-400 dark:text-white"
              placeholder="Add symptom and press Enter..."
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">
              Additional Details (optional)
            </label>
            <textarea
              value={additionalSymptoms}
              onChange={(e) => setAdditionalSymptoms(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Provide more details about your symptoms, duration, severity, etc."
              rows={4}
            />
          </div>
        </section>

        {/* Section 2: Date Selection */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold">2. Choose Your Date *</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-sm">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button 
                    type="button"
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-slate-500 font-medium uppercase">
                {dayNames.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {daysInMonth.map((day, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`p-2 rounded ${!day.isCurrentMonth || day.isPast
                        ? 'text-slate-300 cursor-not-allowed'
                        : day.isSelected
                        ? 'bg-primary text-white font-bold ring-2 ring-primary ring-offset-2'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => handleDateSelect(day)}
                    disabled={!day.isCurrentMonth || day.isPast}
                    title={day.isPast ? "Cannot select past dates" : ""}
                  >
                    {day.day}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="p-6 bg-primary/5 rounded-lg border border-primary/20 h-full">
                <p className="text-primary text-base font-bold flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined">event_available</span>
                  {selectedDate ? (
                    <>Selected: {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</>
                  ) : (
                    <>No date selected</>
                  )}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {selectedDate ? (
                    `You have selected ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })} 
                    for your visit. Our system will automatically assign a doctor based on availability.`
                  ) : (
                    'Please select a future date for your appointment.'
                  )}
                </p>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  HIPAA Compliant Booking
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Note about automatic doctor assignment */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-500">info</span>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-300">Automatic Doctor Assignment</h4>
              <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
                Based on your symptoms, our AI system will detect the appropriate department and automatically assign 
                the most suitable doctor with available slots on your selected date. You'll receive confirmation 
                with doctor details once assigned.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 mb-4">
          <button
            type="submit"
            className="flex-[2] bg-primary text-white font-bold py-4 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !formValid}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                Submitting...
              </span>
            ) : (
              'Submit Pre-registration Request'
            )}
          </button>
          <button
            type="button"
            className="flex-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
          <button
            type="button"
            className="flex-1 bg-transparent text-slate-600 dark:text-slate-300 font-bold py-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            onClick={() => navigate('/appointments')}
          >
            Cancel
          </button>
        </div>
      </form>
    </Layout>
  );
}

export default CreateAppointment;