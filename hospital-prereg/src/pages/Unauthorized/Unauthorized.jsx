import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      
      {/* Icon/Image Section */}
      <div className="mb-8 rounded-full bg-red-50 dark:bg-red-900/20 p-8">
        <span className="material-symbols-outlined text-6xl text-red-500 dark:text-red-400">
            lock
        </span>
      </div>

      {/* Error Badge */}
      <div className="inline-flex items-center justify-center px-3 py-1 mb-6 bg-red-100 dark:bg-red-900/30 rounded-full">
        <span className="text-xs font-bold tracking-wider text-red-600 dark:text-red-400 uppercase">
          Error 403
        </span>
      </div>

      {/* Main Text */}
      <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
        Access Denied
      </h1>
      
      <p className="max-w-md mb-8 text-base text-slate-500 dark:text-slate-400">
        You don't have the necessary permissions to view this page. Please contact your administrator if you believe this is a mistake.
      </p>

      {/* Action Button */}
      <Link 
        to="/" 
        className="inline-flex items-center justify-center h-12 px-8 text-sm font-bold text-white transition-all rounded-lg bg-primary hover:bg-blue-600 shadow-sm hover:shadow-md"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

export default Unauthorized;