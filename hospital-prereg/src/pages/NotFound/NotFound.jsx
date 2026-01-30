import React from 'react';
import { Link } from 'react-router-dom';
import confusedDoctorImage from '../../assets/confused-doctor.jpg';

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center dark:bg-background-dark">
      
      {/* Image Section */}
      <div className="mb-4 rounded-2xl overflow-hidden bg-blue-50 dark:bg-slate-800 p-2 sm:p-8">
        <img 
          src={confusedDoctorImage}
          alt="404 Doctor" 
          className="w-64 h-64 object-cover rounded-xl mix-blend-multiply dark:mix-blend-normal opacity-90"
        />
      </div>

      {/* 404 Badge */}
      <div className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
        <span className="text-xs font-bold tracking-wider text-primary uppercase">
          Error 404
        </span>
      </div>

      {/* Main Text */}
      <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
        Oops! Page Not Found
      </h1>
      
      <p className="max-w-md mb-8 text-base text-slate-500 dark:text-slate-400">
        It seems the medical record or page you're looking for has moved or doesn't exist. Let's get you back on track.
      </p>

      {/* Action Button */}
      <Link to="/" className="inline-flex items-center justify-center h-12 px-8 text-sm font-bold text-white transition-all rounded-lg bg-primary hover:bg-blue-600 shadow-sm hover:shadow-md">
        Return to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;