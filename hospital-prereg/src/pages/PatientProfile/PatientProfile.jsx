import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PatientProfile.css';

function PatientProfile() {
    // State for patient data
    const [patientData, setPatientData] = useState({
        name: "Johnathan Doe",
        gender: "Male",
        date_of_birth: "1989-05-12",
        phone: "+1 (555) 012-3456",
        address: "4521 Maple Avenue, Suite 201, Boston, MA 02108",
        emergency_contact_name: "Sarah Doe (Spouse)",
        emergency_contact_phone: "+1 (555) 987-6543",
        insurance_company_phone: "+1 (800) 123-4567",
        patient_status: "Active",
        id: 12345,
        user_id: 4501,
        status: "Active",
        created_at: "2023-01-15T10:30:00.000Z",
        updated_at: "2024-01-28T13:31:14.271Z",
        age: 34,
        email: "j.doe.medical@example.com",
        verification_status: "Verified",
        last_visit: "2024-01-26T10:00:00.000Z",
        health_summary: "Patient is a 34-year-old male presenting for routine pre-registration. Currently managed for mild hypertension and seasonal allergies. Patient has completed the initial onboarding modules regarding post-operative care and dietary health. No known drug allergies reported at this time."
    });

    // Helper function to format dates
    const formatDate = (dateString, options = {}) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        });
    };

    // Helper function to calculate days ago
    const calculateDaysAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Fetch data from API (example)
    useEffect(() => {
        // Uncomment this to fetch from your API
        /*
        const fetchPatientData = async () => {
            try {
                const response = await fetch('YOUR_API_ENDPOINT/patient-profile');
                const data = await response.json();
                setPatientData(data);
            } catch (error) {
                console.error('Error fetching patient data:', error);
            }
        };
        fetchPatientData();
        */
    }, []);

    // Format patient ID with padding
    const formattedPatientId = `#PAT-${patientData.id.toString().padStart(5, '0')}`;
    const formattedProfileId = `PAT-${patientData.id.toString().padStart(5, '0')}`;
    const formattedUserId = `USR-${patientData.user_id.toString().padStart(4, '0')}`;

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d141b] dark:text-slate-50 min-h-screen">
            <div className="layout-container flex h-full grow flex-col">
                {/* Header */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7edf3] dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-10 py-3 sticky top-0 z-50">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 text-[#0d141b] dark:text-white">
                            <div className="size-8 text-primary">
                                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_6_330)">
                                        <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_6_330">
                                            <rect fill="white" height="48" width="48"></rect>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold leading-tight tracking-tight">MedHealthPortal</h2>
                        </div>
                        <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                                <div className="text-[#4c739a] flex border-none bg-[#e7edf3] dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input 
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141b] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#e7edf3] dark:bg-slate-800 focus:border-none h-full placeholder:text-[#4c739a] px-4 rounded-l-none pl-2 text-base font-normal" 
                                    placeholder="Search records..." 
                                    defaultValue=""
                                />
                            </div>
                        </label>
                    </div>
                    <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
                        <nav className="hidden lg:flex items-center gap-6">
                            <Link className="text-sm font-medium hover:text-primary transition-colors" to="#">Dashboard</Link>
                            <Link className="text-sm font-medium hover:text-primary transition-colors" to="#">Pre-registration</Link>
                            <Link className="text-sm font-medium text-primary border-b-2 border-primary" to="#">Patient Profile</Link>
                            <Link className="text-sm font-medium hover:text-primary transition-colors" to="#">Support</Link>
                        </nav>
                        <div className="flex items-center justify-center rounded-full size-10 border-2 border-primary/20 bg-[#e7edf3] dark:bg-slate-800 text-[#4c739a] dark:text-slate-400">
                            <span className="material-symbols-outlined text-2xl">account_circle</span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-[1280px] mx-auto w-full px-4 md:px-10 py-6">
                    {/* Breadcrumb */}
                    <div className="flex flex-wrap gap-2 py-2 mb-4">
                        <Link className="text-[#4c739a] dark:text-slate-400 text-sm font-medium hover:underline" to="#">
                            Home
                        </Link>
                        <span className="text-[#4c739a] dark:text-slate-400 text-sm">/</span>
                        <span className="text-[#0d141b] dark:text-slate-200 text-sm font-semibold">
                            Patient Profile
                        </span>
                    </div>

                    {/* Patient Profile Header Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-[#e7edf3] dark:border-slate-800 p-6 mb-8">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="flex items-center justify-center rounded-full size-24 md:size-32 ring-4 ring-primary/10 bg-[#e7edf3] dark:bg-slate-800 text-[#4c739a] dark:text-slate-400">
                                        <span className="material-symbols-outlined text-5xl md:text-6xl">person</span>
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full size-6" title="Active Account"></div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-[#0d141b] dark:text-white text-2xl md:text-3xl font-extrabold tracking-tight">
                                            {patientData.name}
                                        </h1>
                                        <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                            {patientData.verification_status}
                                        </span>
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                            {patientData.patient_status}
                                        </span>
                                    </div>
                                    <p className="text-primary font-bold text-lg mt-1 tracking-tight">
                                        ID: {formattedPatientId}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <p className="text-[#4c739a] dark:text-slate-400 text-sm flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                                            Joined {formatDate(patientData.created_at, { year: 'numeric', month: 'short' })}
                                        </p>
                                        <p className="text-[#4c739a] dark:text-slate-400 text-sm flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">history</span>
                                            Last visit: {patientData.last_visit ? 
                                                `${calculateDaysAgo(patientData.last_visit)} days ago` : 
                                                "No recent visits"}
                                        </p>
                                        <p className="text-[#4c739a] dark:text-slate-400 text-sm flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">update</span>
                                            Updated: {formatDate(patientData.updated_at, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link 
                                    to="/edit-profile" 
                                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white text-sm font-bold hover:bg-[#d1dce7] transition-all"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column - Personal Information */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            {/* Personal Information Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-[#e7edf3] dark:border-slate-800 p-6">
                                <h3 className="text-[#0d141b] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    Personal Information
                                </h3>
                                <div className="space-y-6">
                                    {/* Gender */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-background-light dark:bg-slate-800 rounded-lg text-primary">
                                            <span className="material-symbols-outlined">transgender</span>
                                        </div>
                                        <div>
                                            <p className="text-[#4c739a] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Gender</p>
                                            <p className="text-[#0d141b] dark:text-white font-bold">{patientData.gender}</p>
                                        </div>
                                    </div>

                                    {/* Age & DOB */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-background-light dark:bg-slate-800 rounded-lg text-primary">
                                            <span className="material-symbols-outlined">cake</span>
                                        </div>
                                        <div>
                                            <p className="text-[#4c739a] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Age & DOB</p>
                                            <p className="text-[#0d141b] dark:text-white font-bold">
                                                {patientData.age} Years
                                            </p>
                                            <p className="text-[#4c739a] dark:text-slate-400 text-sm">
                                                {formatDate(patientData.date_of_birth)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-background-light dark:bg-slate-800 rounded-lg text-primary">
                                            <span className="material-symbols-outlined">call</span>
                                        </div>
                                        <div>
                                            <p className="text-[#4c739a] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Phone Number</p>
                                            <p className="text-[#0d141b] dark:text-white font-bold">{patientData.phone}</p>
                                            <p className="text-green-600 dark:text-green-400 text-xs font-medium mt-0.5">Mobile • Primary</p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-background-light dark:bg-slate-800 rounded-lg text-primary">
                                            <span className="material-symbols-outlined">mail</span>
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[#4c739a] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Email Address</p>
                                            <p className="text-[#0d141b] dark:text-white font-bold truncate">
                                                {patientData.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-background-light dark:bg-slate-800 rounded-lg text-primary">
                                            <span className="material-symbols-outlined">location_on</span>
                                        </div>
                                        <div>
                                            <p className="text-[#4c739a] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Home Address</p>
                                            <p className="text-[#0d141b] dark:text-white font-bold leading-snug">
                                                {patientData.address.split(',').map((line, index) => (
                                                    <React.Fragment key={index}>
                                                        {line}
                                                        {index < patientData.address.split(',').length - 1 && <br />}
                                                    </React.Fragment>
                                                ))}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Account Status */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-background-light dark:bg-slate-800 rounded-lg text-primary">
                                            <span className="material-symbols-outlined">verified_user</span>
                                        </div>
                                        <div>
                                            <p className="text-[#4c739a] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Account Status</p>
                                            <p className="text-[#0d141b] dark:text-white font-bold">{patientData.status}</p>
                                            <p className="text-[#4c739a] dark:text-slate-400 text-sm">
                                                Profile ID: {formattedProfileId}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Emergency Contact */}
                                    <div className="pt-4 border-t border-[#e7edf3] dark:border-slate-800">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-xs font-bold text-[#4c739a] dark:text-slate-400 uppercase tracking-widest">
                                                Emergency Contact
                                            </p>
                                        </div>
                                        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                                            <p className="text-[#0d141b] dark:text-white font-bold text-sm">
                                                Contact: {patientData.emergency_contact_name}
                                            </p>
                                            <p className="text-primary font-medium text-sm">
                                                Phone: {patientData.emergency_contact_phone}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Insurance Information */}
                                    <div className="pt-4 border-t border-[#e7edf3] dark:border-slate-800">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-xs font-bold text-[#4c739a] dark:text-slate-400 uppercase tracking-widest">
                                                Insurance Information
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                            <p className="text-[#0d141b] dark:text-white font-bold text-sm">
                                                Insurance Company Phone
                                            </p>
                                            <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                                                {patientData.insurance_company_phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-[#e7edf3] dark:border-slate-800 p-6">
                                <h3 className="text-[#0d141b] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">info</span>
                                    Additional Information
                                </h3>
                                <div className="space-y-4">
                                    {/* User ID */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-background-light dark:bg-slate-800 rounded-lg text-primary">
                                            <span className="material-symbols-outlined">badge</span>
                                        </div>
                                        <div>
                                            <p className="text-[#4c739a] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">User ID</p>
                                            <p className="text-[#0d141b] dark:text-white font-bold">
                                                {formattedUserId}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Profile ID */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-background-light dark:bg-slate-800 rounded-lg text-primary">
                                            <span className="material-symbols-outlined">fingerprint</span>
                                        </div>
                                        <div>
                                            <p className="text-[#4c739a] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Profile ID</p>
                                            <p className="text-[#0d141b] dark:text-white font-bold">
                                                {patientData.id}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Created Date */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-background-light dark:bg-slate-800 rounded-lg text-primary">
                                            <span className="material-symbols-outlined">date_range</span>
                                        </div>
                                        <div>
                                            <p className="text-[#4c739a] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Profile Created</p>
                                            <p className="text-[#0d141b] dark:text-white font-bold">
                                                {formatDate(patientData.created_at)}
                                            </p>
                                            <p className="text-[#4c739a] dark:text-slate-400 text-sm">System Registered</p>
                                        </div>
                                    </div>

                                    {/* Last Updated */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-background-light dark:bg-slate-800 rounded-lg text-primary">
                                            <span className="material-symbols-outlined">update</span>
                                        </div>
                                        <div>
                                            <p className="text-[#4c739a] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Last Updated</p>
                                            <p className="text-[#0d141b] dark:text-white font-bold">
                                                {formatDate(patientData.updated_at)}
                                            </p>
                                            <p className="text-[#4c739a] dark:text-slate-400 text-sm">Profile Information</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            {/* Health Profile Summary */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-[#e7edf3] dark:border-slate-800 overflow-hidden">
                                <div className="px-6 py-5 border-b border-[#e7edf3] dark:border-slate-800 flex items-center justify-between">
                                    <h2 className="text-xl font-bold tracking-tight">Health Profile Summary</h2>
                                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded">
                                        Updated: {formatDate(patientData.updated_at, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <p className="text-[#0d141b] dark:text-slate-200 text-lg leading-relaxed">
                                        {patientData.health_summary}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Stats Card */}
                            

                            {/* Medical History Card */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-[#e7edf3] dark:border-slate-800 p-6">
                                <h3 className="text-[#0d141b] dark:text-white text-lg font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">medical_information</span>
                                    Recent Medical History
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-background-light dark:bg-slate-800 rounded-lg">
                                        <div>
                                            <p className="font-medium">Annual Checkup</p>
                                            <p className="text-sm text-[#4c739a] dark:text-slate-400">Completed on Jan 15, 2024</p>
                                        </div>
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-bold px-3 py-1 rounded-full">
                                            Completed
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-background-light dark:bg-slate-800 rounded-lg">
                                        <div>
                                            <p className="font-medium">Blood Test Results</p>
                                            <p className="text-sm text-[#4c739a] dark:text-slate-400">Reviewed on Jan 10, 2024</p>
                                        </div>
                                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
                                            Normal
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-background-light dark:bg-slate-800 rounded-lg">
                                        <div>
                                            <p className="font-medium">Follow-up Appointment</p>
                                            <p className="text-sm text-[#4c739a] dark:text-slate-400">Scheduled for Feb 15, 2024</p>
                                        </div>
                                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                                            Upcoming
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-auto py-8 text-center text-[#4c739a] dark:text-slate-500 text-xs">
                     <p>© 2025 Hospital Central Portal • All patient data is encrypted and HIPAA compliant.</p>
                </footer>
            </div>
        </div>
    );
}

export default PatientProfile;