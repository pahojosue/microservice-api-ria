function Login() {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-[#0d141b] dark:text-slate-100 min-h-screen">
        <div className="flex min-h-screen w-full flex-col lg:flex-row overflow-hidden">
  
          {/* LEFT SIDE – HERO (Desktop only) */}
          <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-primary overflow-hidden">
  
            {/* Background image overlay */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCMY0TfGNhOFcCu1qFXlzHhe_sG1df3Fljz6uOnWXjLXm4H8hITzh0WeMv0BlqUPF5awmD_nk9dW_tbyxeeCrqbaUkkuU1YyAxpvJC4LjxphdOapRoZstaAxZwAf0ZarsuRhDR-CARNT6J4hETW9fUZr0hUwnfBuKmSAkTcRnth_mXPgXb0Cyo8dWnWUSPSaNK1MLJ-7SiS0fEBx3-mXSftk3rnxkvc-cGM0qFn1Q4zEPN8UmGfWrz5xbLQuw0vHd6ZkEmAuQtCuNrM")',
                }}
              />
            </div>
  
            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3 text-white">
              <div className="size-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">
                  medical_services
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">MedApp</h2>
            </div>
  
            {/* Hero text */}
            <div className="relative z-10 max-w-lg">
              <h1 className="text-white text-5xl font-black leading-tight tracking-tight mb-6">
                Professional Care, <br /> Simplified Access.
              </h1>
              <p className="text-white/90 text-lg font-medium leading-relaxed">
                Manage your health journey or professional dashboard from one secure
                location. Access medical records, schedules, and pre-registration
                tools.
              </p>
            </div>
  
            {/* Footer badges */}
            <div className="relative z-10 flex items-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  verified_user
                </span>
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>256-bit Encryption</span>
              </div>
            </div>
          </div>
  
          {/* RIGHT SIDE – LOGIN FORM */}
          <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20">
            <div className="w-full max-w-[440px] flex flex-col gap-8">
  
              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-3 text-primary">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xl">
                    medical_services
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-tight">MedApp</h2>
              </div>
  
              {/* Header */}
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-[#4c739a] dark:text-slate-400">
                  Please enter your details to sign in.
                </p>
              </div>
  
              {/* Role selector */}
              <div className="flex h-12 rounded-xl bg-[#e7edf3] dark:bg-slate-800 p-1.5">
                {["Patient", "Doctor"].map((role, i) => (
                  <label
                    key={role}
                    className="flex cursor-pointer flex-1 items-center justify-center rounded-lg px-2 text-sm font-semibold transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:shadow-sm"
                  >
                    <span>{role}</span>
                    <input
                      type="radio"
                      name="user_role"
                      defaultChecked={i === 0}
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
  
              {/* Form */}
              <form className="flex flex-col gap-5">
  
                {/* Email */}
                <div>
                  <label className="text-sm font-semibold">
                    Email Address
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#4c739a]">
                      mail
                    </span>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
  
                {/* Password */}
                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold">Password</label>
                    <a href="#" className="text-primary text-xs font-bold">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#4c739a]">
                      lock
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4c739a]"
                    >
                      <span className="material-symbols-outlined">
                        visibility
                      </span>
                    </button>
                  </div>
                </div>
  
                {/* Remember me */}
                <label className="flex items-center gap-2 text-sm text-[#4c739a]">
                  <input type="checkbox" className="w-5 h-5" />
                  Keep me signed in for 30 days
                </label>
  
                {/* Submit */}
                <button className="h-14 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20">
                  Sign In
                </button>
              </form>
  
              {/* Footer */}
              <div className="text-center text-sm text-[#4c739a]">
                Are you a medical professional?{" "}
                <a href="#" className="text-primary font-bold">
                  Apply here
                </a>
              </div>
  
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Login;