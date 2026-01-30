import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EditPatient.css'; // Import the CSS file
import NavBar from '../../components/NavBar';

function EditPatient() {
    const navigate = useNavigate();
    
    // State for form data
    const [formData, setFormData] = useState({
        fullname: "Johnathan Doe",
        dob: "1989-05-12",
        gender: "male",
        email: "j.doe.medical@example.com",
        phone: "+1 (555) 012-3456",
        address: "4521 Maple Avenue, Suite 201, Boston, MA 02108",
        emergencyContactName: "Sarah Doe",
        emergencyContactRelation: "Spouse",
        emergencyContactPhone: "+1 (555) 987-6543"
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your API
        console.log('Form submitted:', formData);
        alert('Patient information updated successfully!');
        navigate('/'); // Redirect to patient profile page
    };

    // Handle cancel
    const handleCancel = () => {
        navigate('/'); // Redirect to patient profile page
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d141b] dark:text-slate-50 min-h-screen">
            <div className="layout-container flex h-full grow flex-col">
                {/* Header */}
                <NavBar />

                {/* Main Content */}
                <main className="max-w-[1000px] mx-auto w-full px-4 md:px-10 py-6">
                    {/* Breadcrumb */}
                    <div className="flex flex-wrap gap-2 py-2 mb-4">
                        <Link className="text-[#4c739a] dark:text-slate-400 text-sm font-medium hover:underline" to="/">
                            Patient Profile
                        </Link>
                        <span className="text-[#4c739a] dark:text-slate-400 text-sm">/</span>
                        <span className="text-[#0d141b] dark:text-slate-200 text-sm font-semibold">
                            Edit Information
                        </span>
                    </div>

                    {/* Edit Form Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-[#e7edf3] dark:border-slate-800 overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-primary/5 border-b border-[#e7edf3] dark:border-slate-800 p-8 flex flex-col items-center">
                            <div className="size-24 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center border-4 border-white dark:border-slate-700 text-slate-400 mb-4">
                                <span className="material-symbols-outlined text-5xl">account_circle</span>
                            </div>
                            <h1 className="text-2xl font-bold text-[#0d141b] dark:text-white">Edit Patient Information</h1>
                            <p className="text-[#4c739a] dark:text-slate-400 text-sm mt-1">Update your personal and contact details</p>
                        </div>

                        {/* Form */}
                        <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {/* Full Name */}
                                <div className="col-span-full md:col-span-2">
                                    <label className="block text-sm font-bold text-[#0d141b] dark:text-slate-200 mb-2" htmlFor="fullname">
                                        Full Name
                                    </label>
                                    <input 
                                        className="w-full rounded-lg border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-primary focus:border-primary px-4 py-2.5" 
                                        id="fullname" 
                                        type="text" 
                                        value={formData.fullname}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-bold text-[#0d141b] dark:text-slate-200 mb-2" htmlFor="dob">
                                        Date of Birth
                                    </label>
                                    <input 
                                        className="w-full rounded-lg border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-primary focus:border-primary px-4 py-2.5" 
                                        id="dob" 
                                        type="date" 
                                        value={formData.dob}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-bold text-[#0d141b] dark:text-slate-200 mb-2" htmlFor="gender">
                                        Gender
                                    </label>
                                    <select 
                                        className="w-full rounded-lg border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-primary focus:border-primary px-4 py-2.5" 
                                        id="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-bold text-[#0d141b] dark:text-slate-200 mb-2" htmlFor="email">
                                        Email Address
                                    </label>
                                    <input 
                                        className="w-full rounded-lg border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-primary focus:border-primary px-4 py-2.5" 
                                        id="email" 
                                        type="email" 
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-bold text-[#0d141b] dark:text-slate-200 mb-2" htmlFor="phone">
                                        Phone Number
                                    </label>
                                    <input 
                                        className="w-full rounded-lg border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-primary focus:border-primary px-4 py-2.5" 
                                        id="phone" 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Address */}
                                <div className="col-span-full">
                                    <label className="block text-sm font-bold text-[#0d141b] dark:text-slate-200 mb-2" htmlFor="address">
                                        Home Address
                                    </label>
                                    <textarea 
                                        className="w-full rounded-lg border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-primary focus:border-primary px-4 py-2.5" 
                                        id="address" 
                                        rows="3"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Emergency Contact Information */}
                                <div className="col-span-full mt-4 pt-6 border-t border-[#e7edf3] dark:border-slate-800">
                                    <h3 className="text-[#0d141b] dark:text-white font-bold mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-xl">contact_emergency</span>
                                        Emergency Contact Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Emergency Contact Name */}
                                        <div>
                                            <label className="block text-sm font-bold text-[#0d141b] dark:text-slate-200 mb-2" htmlFor="emergencyContactName">
                                                Contact Name
                                            </label>
                                            <input 
                                                className="w-full rounded-lg border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-primary focus:border-primary px-4 py-2.5" 
                                                id="emergencyContactName" 
                                                type="text" 
                                                value={formData.emergencyContactName}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        {/* Relationship */}
                                        <div>
                                            <label className="block text-sm font-bold text-[#0d141b] dark:text-slate-200 mb-2" htmlFor="emergencyContactRelation">
                                                Relationship
                                            </label>
                                            <input 
                                                className="w-full rounded-lg border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-primary focus:border-primary px-4 py-2.5" 
                                                id="emergencyContactRelation" 
                                                type="text" 
                                                value={formData.emergencyContactRelation}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        {/* Emergency Phone */}
                                        <div className="col-span-full">
                                            <label className="block text-sm font-bold text-[#0d141b] dark:text-slate-200 mb-2" htmlFor="emergencyContactPhone">
                                                Contact Phone Number
                                            </label>
                                            <input 
                                                className="w-full rounded-lg border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-primary focus:border-primary px-4 py-2.5" 
                                                id="emergencyContactPhone" 
                                                type="tel" 
                                                value={formData.emergencyContactPhone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-10 pt-6 border-t border-[#e7edf3] dark:border-slate-800">
                                <button 
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-8 py-3 rounded-lg text-sm font-bold text-[#4c739a] dark:text-slate-300 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-8 py-3 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-600 shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">save</span>
                                    Save Changes
                                </button>
                            </div>
                        </form>
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

export default EditPatient;