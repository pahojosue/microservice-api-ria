// src/pages/CreateAppointment/CreateAppointment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';

function CreateAppointment() {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState(['Fever', 'Cough', 'Fatigue']);
  const [newSymptom, setNewSymptom] = useState('');
  const [selectedDate, setSelectedDate] = useState('2023-10-11');
  const [selectedDoctor, setSelectedDoctor] = useState('doc1');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calendar data
  const [currentMonth, setCurrentMonth] = useState(new Date(2023, 9, 1)); // October 2023
  const [daysInMonth, setDaysInMonth] = useState([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth]);

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
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        day: i,
        isCurrentMonth: true,
        date,
        isSelected: i === 11 && month === 9 && year === 2023 // Selected: Oct 11, 2023
      });
    }

    setDaysInMonth(days);
  };

  const handleAddSymptom = (e) => {
    if (e.key === 'Enter' && newSymptom.trim()) {
      setSymptoms([...symptoms, newSymptom.trim()]);
      setNewSymptom('');
    }
  };

  const handleRemoveSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleDateSelect = (day) => {
    if (day.isCurrentMonth) {
      setSelectedDate(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const appointmentData = {
      symptoms,
      date: selectedDate,
      doctor: selectedDoctor,
      time: selectedTime,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:5000/api/appointments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create appointment');
      }

      setSuccess('Appointment pre-registration submitted successfully!');
      
      // Redirect to appointments list after 2 seconds
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error('Appointment creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    const draftData = {
      symptoms,
      date: selectedDate,
      doctor: selectedDoctor,
      time: selectedTime,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('appointmentDraft', JSON.stringify(draftData));
    alert('Draft saved successfully!');
  };

  const doctors = [
    {
      id: 'doc1',
      name: 'Dr. Sarah Jenkins',
      specialty: 'Internal Medicine',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC86kVoyOVJ_5p4QLvi2N5bFI2mY_acHHQimtHYZaQKqYXwm38xUerdNQuKpCtpWrqZe3e3_PLtGg_wgPC9Wx5DGJL7H2yp8vFRBvfDeORPHlIRO1zpy4oorPvNp0KrfsDhrVNEIeGq98lYYTMyXuLq99ufTDlS_f-DapMmjeN_y2_AX-svl1Y8fRK7yjNS04fkPCmFaiVvI-2JsgV_xIpv4YJUldXqdXagbokuyh9ASz5XkyNHhm1qQxI6R1q0dr8Pf1r_U4Dspjmk',
      rating: '4.9 (124 reviews)',
      slots: ['09:30 AM', '11:00 AM', '02:15 PM']
    },
    {
      id: 'doc2',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9kMYtmZWN7f4yAxBY_lbYCktwkrVwU_0qttebGRXamZXqseD0NzCEI6z0qwgee-6a7EartoPeb1tzJnTmaXkpb8Tz0TxoxHhP1DaSB8JqHXpJdc8bfo1yNDVa8GcByTs3XtYARo5DybmAKQyXmLWI2Up51njiJe__S2szKrQn6b-75WEuSW01BHgCaH1Fb1rVPtrL9GwU6oA98XTpELZgAFlnaB1rGUVNqs_fsyiinn91gqAw0bB2VGxuV8xZCJPceS40I5FoQ5xm',
      rating: '4.8 (98 reviews)',
      slots: ['08:00 AM', '10:45 AM', '04:30 PM']
    }
  ];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  return (
    <Layout>
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {success}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            New Appointment Pre-registration
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
            Complete the form below to streamline your check-in process. Tell us about your symptoms and choose a specialist.
          </p>
        </div>
        <button 
          className="flex items-center justify-center rounded-lg h-10 px-6 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-200 transition-colors"
          onClick={() => navigate('/appointments')}
        >
          View History
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Section 1: Symptoms */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">stethoscope</span>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold">1. Select Your Symptoms</h2>
          </div>
          <p className="text-slate-500 text-sm mb-4">Type your symptoms and press enter to add them as tags.</p>
          <div className="tag-input-container flex flex-wrap items-center gap-2 p-3 min-h-[56px] w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 transition-all">
            {symptoms.map((symptom, index) => (
              <div key={index} className="flex items-center gap-1.5 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                {symptom}
                <button 
                  className="hover:text-red-200 flex items-center"
                  onClick={() => handleRemoveSymptom(index)}
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
            ))}
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 min-w-[120px] text-sm py-1 placeholder:text-slate-400 dark:text-white"
              placeholder="Add more symptoms..."
              type="text"
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              onKeyDown={handleAddSymptom}
            />
          </div>
        </section>

        {/* Section 2: Date Selection */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold">2. Choose Your Date</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-sm">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <div className="flex gap-2">
                  <button 
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button 
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
                  <div
                    key={index}
                    className={`p-2 rounded cursor-pointer ${
                      !day.isCurrentMonth
                        ? 'text-slate-300'
                        : day.isSelected
                        ? 'bg-primary text-white font-bold ring-2 ring-primary ring-offset-2'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => handleDateSelect(day)}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="p-6 bg-primary/5 rounded-lg border border-primary/20 h-full">
                <p className="text-primary text-base font-bold flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined">event_available</span>
                  Selected: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  You have selected mid-week for your visit. Our specialists often have more availability during morning slots on Wednesdays.
                </p>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  HIPAA Compliant Booking
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Doctor & Time Selection */}
        <section className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">person_search</span>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold">3. Select Your Doctor & Time</h2>
          </div>
          <p className="text-slate-500 text-sm mb-6">Available specialists based on your selected date.</p>
          <div className="grid grid-cols-1 gap-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="relative">
                <input
                  className="peer hidden doctor-card-radio"
                  id={doctor.id}
                  name="doctor_selection"
                  type="radio"
                  checked={selectedDoctor === doctor.id}
                  onChange={(e) => setSelectedDoctor(e.target.id)}
                />
                <label
                  className="flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-primary/50 transition-all bg-slate-50/50 dark:bg-slate-800/30"
                  htmlFor={doctor.id}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="size-20 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-white dark:border-slate-700 shadow-sm">
                      <img
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                        src={doctor.image}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{doctor.name}</h3>
                      <p className="text-sm text-primary font-semibold">{doctor.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                        <span className="text-xs text-slate-500">{doctor.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 md:pl-6 pt-4 md:pt-0">
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-3 tracking-wider">Available Slots</p>
                    <div className="flex flex-wrap gap-2">
                      {doctor.slots.map((slot) => (
                        <span
                          key={slot}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            selectedTime === slot
                              ? 'bg-primary text-white border border-primary shadow-sm'
                              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-primary hover:text-white'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedTime(slot);
                            setSelectedDoctor(doctor.id);
                          }}
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 mb-4">
          <button
            className="flex-[2] bg-primary text-white font-bold py-4 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 text-lg disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Pre-registration Request'}
          </button>
          <button
            className="flex-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default CreateAppointment;