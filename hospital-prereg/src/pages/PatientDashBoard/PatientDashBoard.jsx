import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import HomePatientSideBar from './components/HomePatientSideBar';
import HomeArticleCard from './components/HomeArticleCard';
import { Link } from 'react-router-dom';
import { getCurrentPatientData } from '../../services/patientService';

function PatientDashBoard() {

  const [loadingPatientData, setLoadingPatientData] = useState(false);
  const [patientData, setPatientData] = useState({});

  //Get current patient data on Login
  useEffect(() => {
    const loadPatientData = async () => {
      try {
        setLoadingPatientData(true)
        const response = await getCurrentPatientData();
        if(!response.ok) {
          switch(response.status) {
            case 403:
              console.log(response.data?.detail);
              break;
            case 404:
              console.log(response.data?.detail);
              break;
            case 500:
              console.log("Server Error");
              break;
            default:
              console.log("Error");
          }
          return;
        }

        setPatientData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingPatientData(false);
      }
    }

    loadPatientData();
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen text-slate-900 dark:text-white">

      <div className="relative flex flex-col w-full">
        {/* Header */}
        <NavBar />

        {/* Main Content */}
        <main className="max-w-[1200px] mx-auto w-full px-4 md:px-10 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar (Aside) */}
            <HomePatientSideBar patientData={patientData} isLoading={loadingPatientData} />

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
                      <Link to="/create-appointment">
                        <span className="material-symbols-outlined text-2xl">add_circle</span>
                      </Link>
                    </div>
                    <Link to="/create-appointment">
                      <div className="text-left">
                        <p className="font-bold text-xl">Book New Appointment</p>
                        <p className="text-white/80 text-sm">Schedule a visit with your primary care physician or a specialist</p>
                      </div>
                    </Link>
                  </button>
                </div>
              </section>

              {/* Recommended Articles */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-slate-900 dark:text-white text-xl font-bold">Recommended Articles</h2>
                    <Link to="/medical-content" className="text-primary text-sm font-semibold hover:text-black">View All</Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {/* Article 1 */}
                  <HomeArticleCard 
                    title={"Nutrition"}
                    description={"Healthy Diet Tips for health recovery"}
                    imageUrl={"https://lh3.googleusercontent.com/aida-public/AB6AXuCvNo2eJVn8J_ScLnZeBY24eKgcQg8kTtyhbtVpKVnLdLqpwcht7rwdw5xgYle-_D0p5hnqe0Bwg_1pZpLhcDVrQIgXFPvkT28hw4x8lZ_4iufcdktIXPTw_-0GIKEQ9X1BpJ4kWWQccuWt19jEuAd9JLayQcy8nEpsa30cBlJrZOUdYIyv3tyL_Dq7cqE5AZS7l-NdX6XqJsEE4-w757E7ZwnJfjB5Dv1KDYGctFqTyijn8nAyRkB7yf-LWiUnlfY8VUkfo7iLoroU"}
                    readMinutes={5}
                  />

                  {/* Article 2 */}
                  <HomeArticleCard 
                    title={"Wellness"}
                    description={"Understanding Blood Pressure Basics"}
                    imageUrl={"https://lh3.googleusercontent.com/aida-public/AB6AXuC-_msgo6Ep652xf64ibjSAamQ-OrxaF_ndALAJ0foEEvlOe1-eDRsO59Vlv2qM3XRz4oWmTrAWDFmLPcuZ5jJ8LZznikZn87C1LrITVpWSFUiarc_qH5aG3uceL9LhetSOGEj0lUSy6lturb9MCUBX_jIER_Tx0rKOOGoZFwOw4EGn3wxjuvvgeETLbA5lZwHF8HGYze8F1KNDvD2YBr8rIB2qmyRJg45STJXxJzeLfKfWLgpmg68iQvX2Bl_bZku4MjevDkLUt7Yn"}
                    readMinutes={8}
                  />

                  {/* Article 3 */}
                  <HomeArticleCard
                    title={"Guide"}
                    description={"Post-Surgery Care: What to Expect"}
                    imageUrl={"https://lh3.googleusercontent.com/aida-public/AB6AXuAssXuP65VzTTtLKDE--ZjOqlAnQQ7KB0NgCKuhI78y9fVmwoKW9wsski2z6RgWDxOflKK9ngCyToyteomX2RISrCQF3ga1YBeqbTQOG1rCfMo13UF6p9LCVTp0HfjIxiXJcYCWdLfCvsUo_HDBUEjHD4c0DLo1ILcXcYecJ3gCxuuyIrrWcWLtVGWNkFVcMogmDSaWjI51lz-jTkcCiIsrQWRpDpGyxke2g26Jtk_w4Tcy79ax6Fkkj0p2_QZzvIrAI_Iuj1o4ik3W"}
                    readMinutes={12}
                  />
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