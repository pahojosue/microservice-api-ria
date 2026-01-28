import React from 'react';

function PatientDashBoard() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen text-slate-900 dark:text-white">
      
      {/* This style block handles the scrollbar hiding. 
         Ideally, move this to your index.css file. 
      */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="relative flex flex-col w-full">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-10 py-3">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 text-primary">
              <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">medical_services</span>
              </div>
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                HealthPortal
              </h2>
            </div>
            <div className="flex flex-1 justify-end gap-6 items-center">
              <nav className="hidden md:flex items-center gap-8">
                <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Profile</a>
                <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Appointments</a>
                <a className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">Learning</a>
              </nav>
              <div className="flex items-center gap-3">
                <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20" 
                  data-alt="Portrait of a female patient" 
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB8DrBEUCMl0fvoWYZfDOqwpnAB4WiDp8WYV8qzsiloYt5Eh-FPKFFGtO7DufO6DSXMQfmZtpN1OdkAQ-JzBfG-GYvEf7AeX-wkNZSYfMIQbNGn2gqL5B1n6hDQLj20lVsOA-5wZAVSMeL1aCYyMTRnwKHLZ8cy3Tn5QaNH-Go6zcPBi0As-wlLIOrF-PUjS6uWLR7fCf14m1sQA0syNJ-bj5wzZtTAFKwaX3cNPes5N25WYKkaVIyfdrlLJGQJHb8ACG6s_wkNUxM9")' }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1200px] mx-auto w-full px-4 md:px-10 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar (Aside) */}
            <aside className="lg:col-span-4 flex flex-col gap-4">
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex flex-col items-center text-center mb-6">
                  <div 
                    className="size-24 bg-center bg-no-repeat bg-cover rounded-full border-4 border-primary/10 mb-4" 
                    data-alt="Portrait of Jane" 
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB8DrBEUCMl0fvoWYZfDOqwpnAB4WiDp8WYV8qzsiloYt5Eh-FPKFFGtO7DufO6DSXMQfmZtpN1OdkAQ-JzBfG-GYvEf7AeX-wkNZSYfMIQbNGn2gqL5B1n6hDQLj20lVsOA-5wZAVSMeL1aCYyMTRnwKHLZ8cy3Tn5QaNH-Go6zcPBi0As-wlLIOrF-PUjS6uWLR7fCf14m1sQA0syNJ-bj5wzZtTAFKwaX3cNPes5N25WYKkaVIyfdrlLJGQJHb8ACG6s_wkNUxM9")' }}
                  ></div>
                  <h3 className="text-slate-900 dark:text-white font-bold text-xl">Jane Cooper</h3>
                  <p className="text-primary text-sm font-medium">Patient ID: #HP-2024-0892</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Demographics</span>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400 text-sm">Age</span>
                      <span className="text-slate-900 dark:text-white text-sm font-semibold">32 Years</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400 text-sm">Gender</span>
                      <span className="text-slate-900 dark:text-white text-sm font-semibold">Female</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400 text-sm">Blood Type</span>
                      <span className="text-red-500 text-sm font-bold">O+ Positive</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 mt-4">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Contact Information</span>
                    <div className="flex items-start gap-3 py-2">
                      <span className="material-symbols-outlined text-slate-400 text-lg">mail</span>
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-white text-sm font-medium">jane.cooper@example.com</span>
                        <span className="text-[10px] text-slate-500 uppercase">Primary Email</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-2">
                      <span className="material-symbols-outlined text-slate-400 text-lg">call</span>
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-white text-sm font-medium">+1 (555) 012-3456</span>
                        <span className="text-[10px] text-slate-500 uppercase">Mobile</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-2">
                      <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span>
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-white text-sm font-medium">2464 Royal Ln. Mesa, New Jersey 45463</span>
                        <span className="text-[10px] text-slate-500 uppercase">Home Address</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button className="w-full py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Edit Profile
                  </button>
                </div>
              </div>

              <button className="w-full py-4 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 shadow-md transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-xl">logout</span>
                Logout
              </button>
            </aside>

            {/* Dashboard Content */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Good morning, Jane</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Here's what's happening with your health today.</p>
              </div>

              {/* Appointment Section */}
                <section>
                <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col md:flex-row">
                    
                    {/* Left Side: Image */}
                    <div 
                    className="w-full md:w-1/3 lg:w-1/4 h-48 md:h-auto bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDbd4TLzcCnl6YuUkxGh1lHNup6jODO7gVqh_sZfqfO61QfmLGWBc4wRs-G7rxpqCux8pNYynBzgpDneVV7nOFiAu4mqiDOsMX40Fxmyhb0BHtp_rrG4U4o4t9IGngk2VwK-GaXWeg8rog-CEtYYq4j-hXa0kC6tCNMd4NCSzXxjRRBuy4xNLJNMpYsZQ3q79RTQtClQmn5ZaRVQyKHT_wPJqk4LV0azy4BPekIh-NgZX_UFXXB9wdBxuYQm--vfi-e3wXTSmzPxj25")' }}
                    aria-label="A modern hospital examination room"
                    ></div>

                    {/* Right Side: Content */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    
                    {/* Header Labels */}
                    <div className="mb-4">
                        <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2 block">
                        Upcoming Appointment
                        </span>
                        <h3 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">
                        Cardiology Checkup
                        </h3>
                    </div>

                    {/* Details Row */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        
                        {/* Date & Location Info */}
                        <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                            <span className="text-base font-medium">Oct 12, 10:00 AM • Dr. Sarah Jenkins</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                            <span className="material-symbols-outlined text-[20px]">location_on</span>
                            <span className="text-base font-medium">Main Hospital, Building B, Room 402</span>
                        </div>
                        </div>

                        {/* Action Button */}
                        <button className="bg-primary hover:bg-blue-600 text-white text-sm font-bold py-3 px-8 rounded-lg transition-colors shadow-sm whitespace-nowrap">
                        Join Details
                        </button>
                    </div>

                    </div>
                </div>
                </section>

              {/* Quick Actions */}
              <section>
                <h2 className="text-slate-900 dark:text-white text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1">
                  <button className="flex items-center gap-4 p-5 rounded-xl bg-primary text-white shadow-md hover:shadow-lg transition-all group">
                    <div className="size-14 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl">add_circle</span>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-xl">Book New Appointment</p>
                      <p className="text-white/80 text-sm">Schedule a visit with your primary care physician or a specialist</p>
                    </div>
                  </button>
                </div>
              </section>

              {/* Recommended Articles */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-slate-900 dark:text-white text-xl font-bold">Recommended Articles</h2>
                  <a className="text-primary text-sm font-semibold hover:underline" href="#">View All</a>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {/* Article 1 */}
                  <div className="flex-none w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                    <div 
                      className="h-32 bg-cover bg-center" 
                      data-alt="Fresh vegetables on a plate" 
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvNo2eJVn8J_ScLnZeBY24eKgcQg8kTtyhbtVpKVnLdLqpwcht7rwdw5xgYle-_D0p5hnqe0Bwg_1pZpLhcDVrQIgXFPvkT28hw4x8lZ_4iufcdktIXPTw_-0GIKEQ9X1BpJ4kWWQccuWt19jEuAd9JLayQcy8nEpsa30cBlJrZOUdYIyv3tyL_Dq7cqE5AZS7l-NdX6XqJsEE4-w757E7ZwnJfjB5Dv1KDYGctFqTyijn8nAyRkB7yf-LWiUnlfY8VUkfo7iLoroU')" }}
                    ></div>
                    <div className="p-4 flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Nutrition</span>
                      <h4 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-2">Healthy Diet Tips for Heart Recovery</h4>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        <span>5 min read</span>
                      </div>
                    </div>
                  </div>

                  {/* Article 2 */}
                  <div className="flex-none w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                    <div 
                      className="h-32 bg-cover bg-center" 
                      data-alt="Person doing yoga at home" 
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-_msgo6Ep652xf64ibjSAamQ-OrxaF_ndALAJ0foEEvlOe1-eDRsO59Vlv2qM3XRz4oWmTrAWDFmLPcuZ5jJ8LZznikZn87C1LrITVpWSFUiarc_qH5aG3uceL9LhetSOGEj0lUSy6lturb9MCUBX_jIER_Tx0rKOOGoZFwOw4EGn3wxjuvvgeETLbA5lZwHF8HGYze8F1KNDvD2YBr8rIB2qmyRJg45STJXxJzeLfKfWLgpmg68iQvX2Bl_bZku4MjevDkLUt7Yn')" }}
                    ></div>
                    <div className="p-4 flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Wellness</span>
                      <h4 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-2">Understanding Blood Pressure Basics</h4>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        <span>8 min read</span>
                      </div>
                    </div>
                  </div>

                  {/* Article 3 */}
                  <div className="flex-none w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                    <div 
                      className="h-32 bg-cover bg-center" 
                      data-alt="A stethoscope on a desk" 
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAssXuP65VzTTtLKDE--ZjOqlAnQQ7KB0NgCKuhI78y9fVmwoKW9wsski2z6RgWDxOflKK9ngCyToyteomX2RISrCQF3ga1YBeqbTQOG1rCfMo13UF6p9LCVTp0HfjIxiXJcYCWdLfCvsUo_HDBUEjHD4c0DLo1ILcXcYecJ3gCxuuyIrrWcWLtVGWNkFVcMogmDSaWjI51lz-jTkcCiIsrQWRpDpGyxke2g26Jtk_w4Tcy79ax6Fkkj0p2_QZzvIrAI_Iuj1o4ik3W')" }}
                    ></div>
                    <div className="p-4 flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Guide</span>
                      <h4 className="text-slate-900 dark:text-white font-bold text-sm line-clamp-2">Post-Surgery Care: What to Expect</h4>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <span className="material-symbols-outlined text-xs">schedule</span>
                        <span>12 min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PatientDashBoard;