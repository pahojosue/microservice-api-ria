import { useState } from "react"; // 1. Import useState
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/userService";

function Login() {
  // 2. Create state to track the active role (Default to 'Patient')
  const [userRole, setUserRole] = useState("Patient");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!userEmail.trim() || !userPassword.trim()) return;

    setLoading(true);

    try {
      const email = userEmail;
      const password = userPassword;
      const data = await loginUser(email, password, userRole === "Patient" ? "patient" : "doctor");
      
      if(!data.ok) {
        switch(data.status) {
          case 403:
            console.log(data.data?.detail);
            setError(data.data?.detail)
            break;
          case 404:
            console.log(data.data?.detail);
            setError(data.data?.detail)
            break;
          case 500:
            console.log("Server Error");
            setError("Server Error")
            break;
          default:
            setError("Server Error")
        }
        return;
      }

      //Save token in storage
      localStorage.setItem("accessToken", data.data.access_token);
      localStorage.setItem("userEmail", userEmail);
      //Save the role of the currently connected user
      localStorage.setItem("userRole", userRole === "Patient" ? "patient" : "doctor");

      userRole === "Patient" ? navigate("/") : navigate("/doctor-home");
    } catch (error) {
      console.log(error);
      setError("Server Error")
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#0d141b] dark:text-slate-100 min-h-screen">
      <div className="flex min-h-screen w-full flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT SIDE – HERO */}
        <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-primary overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCMY0TfGNhOFcCu1qFXlzHhe_sG1df3Fljz6uOnWXjLXm4H8hITzh0WeMv0BlqUPF5awmD_nk9dW_tbyxeeCrqbaUkkuU1YyAxpvJC4LjxphdOapRoZstaAxZwAf0ZarsuRhDR-CARNT6J4hETW9fUZr0hUwnfBuKmSAkTcRnth_mXPgXb0Cyo8dWnWUSPSaNK1MLJ-7SiS0fEBx3-mXSftk3rnxkvc-cGM0qFn1Q4zEPN8UmGfWrz5xbLQuw0vHd6ZkEmAuQtCuNrM")',
              }}
            />
          </div>
          <div className="relative z-10 flex items-center gap-3 text-white">
            <div className="size-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">medical_services</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">MedApp</h2>
          </div>
          <div className="relative z-10 max-w-lg">
            <h1 className="text-white text-5xl font-black leading-tight tracking-tight mb-6">
              Professional Care, <br /> Simplified Access.
            </h1>
            <p className="text-white/90 text-lg font-medium leading-relaxed">
              Manage your health journey or professional dashboard from one secure location.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
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
            
            <div className="lg:hidden flex items-center gap-3 text-primary">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">medical_services</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">MedApp</h2>
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
              <p className="text-[#4c739a] dark:text-slate-400">
                Please enter your details to sign in as a <span className="text-primary font-bold">{userRole}</span>.
              </p>
            </div>

            {/* --- UPDATED ROLE SELECTOR --- */}
            <div className="flex h-12 rounded-xl bg-[#e7edf3] dark:bg-slate-800 p-1.5">
              {["Patient", "Doctor"].map((role) => (
                <label
                  key={role}
                  className="flex cursor-pointer flex-1 items-center justify-center rounded-lg px-2 text-sm font-semibold transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:shadow-sm has-[:checked]:text-primary">
                  <span>{role}</span>
                  <input
                    type="radio"
                    name="user_role"
                    value={role}
                    // 3. Bind checked to state condition
                    checked={userRole === role}
                    // 4. Update state on change
                    onChange={() => setUserRole(role)}
                    className="hidden"
                  />
                </label>
              ))}
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              <div>
                <label className="text-sm font-semibold">Email Address</label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#4c739a]">mail</span>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">Password</label>
                </div>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#4c739a]">lock</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4c739a]" onClick={() => setShowPassword(!showPassword)}>
                    <span className="material-symbols-outlined">{showPassword? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              {
                error
                ?
                <div className="text-sm text-[#ff0000]">{error}</div>
                :
                null
              }

              <button 
                disabled={loading} // 1. Disable button while loading
                className={`h-14 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2
                  ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"}
                `}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {
              userRole === "Patient"
              ? 
              <div className="text-center text-sm text-[#4c739a]">
              You don't have an account?{" "}
              <Link to="/signup" className="text-primary font-bold hover:underline">
                Signup
              </Link>
              </div>
              :
              null
            }

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;