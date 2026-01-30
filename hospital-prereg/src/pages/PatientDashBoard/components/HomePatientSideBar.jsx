import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HomePatientSideBar = ({ patientData, isLoading }) => {
    const navigate = useNavigate();

    const HandleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Helper to calculate age from DOB string (e.g., "2005-12-22")
    const calculateAge = (dobString) => {
        if (!dobString) return "N/A";
        const today = new Date();
        const birthDate = new Date(dobString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} Years`;
    };

    return (
        <aside className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                
                {/* --- PROFILE HEADER SECTION --- */}
                <div className="flex flex-col items-center text-center mb-6">
                    {isLoading ? (
                        // Skeleton for Avatar
                        <Skeleton circle height={96} width={96} className="mb-4" />
                    ) : (
                        // Default SVG Avatar (Since no image in API)
                        <div className="size-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-4 border-4 border-primary/10 text-slate-400">
                             <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}

                    {isLoading ? (
                        // Skeleton for Name & ID
                        <div className="flex flex-col gap-2 items-center w-full">
                            <Skeleton width={150} height={24} />
                            <Skeleton width={100} height={16} />
                        </div>
                    ) : (
                        <>
                            <h3 className="text-slate-900 dark:text-white font-bold text-xl">
                                {patientData?.first_name ?? "null"} {patientData?.last_name ?? "null"}
                            </h3>
                            <p className="text-primary text-sm font-medium">
                                Patient ID: {patientData.id ?? "null"}
                            </p>
                        </>
                    )}
                </div>

                <div className="space-y-4">
                    {/* --- DEMOGRAPHICS SECTION --- */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Demographics</span>
                        
                        {/* Age Row */}
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-600 dark:text-slate-400 text-sm">Age</span>
                            <span className="text-slate-900 dark:text-white text-sm font-semibold">
                                {isLoading ? <Skeleton width={50} /> : calculateAge(patientData?.date_of_birth)}
                            </span>
                        </div>

                        {/* Gender Row */}
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-slate-600 dark:text-slate-400 text-sm">Gender</span>
                            <span className="text-slate-900 dark:text-white text-sm font-semibold">
                                {isLoading ? <Skeleton width={60} /> : patientData?.gender}
                            </span>
                        </div>
                    </div>

                    {/* --- CONTACT INFO SECTION --- */}
                    <div className="flex flex-col gap-1 mt-4">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Contact Information</span>
                        
                        {/* Email (Static/Placeholder since not in API) */}
                        <div className="flex items-start gap-3 py-2">
                            <span className="material-symbols-outlined text-slate-400 text-lg">mail</span>
                            <div className="flex flex-col w-full">
                                {isLoading ? <Skeleton width="80%" /> : (
                                    <span className="text-slate-900 dark:text-white text-sm font-medium">
                                        {localStorage.getItem("userEmail")}
                                    </span>
                                )}
                                <span className="text-[10px] text-slate-500 uppercase">Primary Email</span>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-3 py-2">
                            <span className="material-symbols-outlined text-slate-400 text-lg">call</span>
                            <div className="flex flex-col w-full">
                                {isLoading ? <Skeleton width="60%" /> : (
                                    <span className="text-slate-900 dark:text-white text-sm font-medium">
                                        {patientData?.phone}
                                    </span>
                                )}
                                <span className="text-[10px] text-slate-500 uppercase">Mobile</span>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-3 py-2">
                            <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                            <div className="flex flex-col w-full">
                                {isLoading ? <Skeleton count={2} /> : (
                                    <span className="text-slate-900 dark:text-white text-sm font-medium">
                                        {patientData?.address}
                                    </span>
                                )}
                                <span className="text-[10px] text-slate-500 uppercase">Home Address</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Link to="/edit-profile">
                        <button className="w-full py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">edit</span>
                            Edit Profile
                        </button>
                    </Link>
                </div>
            </div>

            <button 
                className="w-full py-4 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 shadow-md transition-all flex items-center justify-center gap-2" 
                onClick={HandleLogout}
            >
                <span className="material-symbols-outlined text-xl">logout</span>
                Logout
            </button>
        </aside>
    );
};

export default HomePatientSideBar;