function Signup() {
    return (
      <div className="bg-background-light dark:bg-background-dark text-[#0d141b] dark:text-slate-200 min-h-screen font-display">
        <main className="flex flex-col items-center py-10 px-4">
          <div className="w-full max-w-[800px] flex flex-col gap-6">
  
            {/* Page Header */}
            <div className="px-4">
              <h1 className="text-4xl font-black tracking-tight">
                Patient Registration
              </h1>
              <p className="text-[#4c739a] dark:text-slate-400">
                Complete the form below to create your patient portal account.
              </p>
            </div>
  
            {/* Registration Form */}
            <form className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 p-8 flex flex-col gap-10">
  
              {/* PERSONAL IDENTIFICATION */}
              <section>
                <h3 className="text-xl font-bold border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
                  Personal Identification
                </h3>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      National ID / Social Security
                    </label>
                    <input
                      type="text"
                      placeholder="XXX-XX-XXXX"
                      className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      Gender
                    </label>
                    <select className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </section>
  
              {/* CONTACT DETAILS */}
              <section>
                <h3 className="text-xl font-bold border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
                  Contact Details
                </h3>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <span className="material-symbols-outlined text-lg">
                          call
                        </span>
                      </span>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="h-12 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full"
                      />
                    </div>
                  </div>
  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <span className="material-symbols-outlined text-lg">
                          mail
                        </span>
                      </span>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        required
                        className="h-12 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full"
                      />
                    </div>
                  </div>
  
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-semibold">
                      Residential Address
                    </label>
                    <textarea
                      placeholder="Street name, City, State, ZIP code"
                      className="min-h-[100px] p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              </section>
  
              {/* ACCOUNT SECURITY */}
              <section>
                <h3 className="text-xl font-bold border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
                  Account Security
                </h3>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <span className="material-symbols-outlined text-lg">
                          lock
                        </span>
                      </span>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        className="h-12 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Must be at least 8 characters
                    </p>
                  </div>
  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <span className="material-symbols-outlined text-lg">
                          lock_reset
                        </span>
                      </span>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        className="h-12 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full"
                      />
                    </div>
                  </div>
                </div>
              </section>
  
              {/* ACTIONS */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Already have an account?{" "}
                  <a href="#" className="text-primary font-semibold hover:underline">
                    Log in
                  </a>
                </p>
  
                <div className="flex gap-4 w-full md:w-auto">
                  <button
                    type="button"
                    className="flex-1 md:flex-none px-8 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
  
                  <button
                    type="submit"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 h-12 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90"
                  >
                    Create Account
                    <span className="material-symbols-outlined">
                      person_add
                    </span>
                  </button>
                </div>
              </div>
            </form>
  
            {/* FOOTER */}
            <footer className="flex justify-center gap-6 py-6 border-t border-slate-200 dark:border-slate-800 mt-4">
              <a className="text-xs text-slate-400 hover:text-primary uppercase tracking-widest font-semibold" href="#">
                Privacy Policy
              </a>
              <a className="text-xs text-slate-400 hover:text-primary uppercase tracking-widest font-semibold" href="#">
                Terms of Service
              </a>
              <a className="text-xs text-slate-400 hover:text-primary uppercase tracking-widest font-semibold" href="#">
                Cookie Policy
              </a>
            </footer>
  
          </div>
        </main>
      </div>
    );
  }
  
  export default Signup;