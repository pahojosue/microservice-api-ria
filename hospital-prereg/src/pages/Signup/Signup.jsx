import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../services/userService";
import { createPatient } from "../../services/patientService";

function Signup() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState(new Date());
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [emergencyName, setEmergencyName] = useState("");
    const [emergencyPhone, setEmergencyPhone] = useState("");
    const [password_1, setPassword_1] = useState("");
    const [password_2, setPassword_2] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
      e.preventDefault();
      if(!(password_1 === password_2)) {
        setError("The two passwords must be the same");
        return;
      }
      setLoading(true);

      try {
        //First create the User
        const userEmail = email;
        const userPassword = password_1;
        const userRole = "patient";

        const data = await signupUser(userEmail, userPassword, userRole);
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

        //Now create the Patient
        const PatientData = await createPatient(firstName, lastName, gender, dob, phone, address, emergencyName, emergencyPhone, data.data.id);
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

        //Successfully created patient
        navigate("/login");
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }


    return (
      <div className="bg-background-light dark:bg-background-dark text-[#0d141b] dark:text-slate-200 min-h-screen font-display">
        <main className="flex flex-col items-center py-10 px-4">
          <div className="w-full max-w-[800px] flex flex-col gap-6">
            
            <div className="text-4xl font-bold">Patient Registration</div>
            <div className="text-md mb-0 mt-0 text-[#4c739a]">Complete the form below to create your patient account</div>
  
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
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/50"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/50"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
  
                  {/* <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      National ID / Social Security
                    </label>
                    <input
                      type="text"
                      placeholder="XXX-XX-XXXX"
                      className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      onChange={(e) => setNationalId(e.target.value)}
                    />
                  </div> */}
  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      Gender
                    </label>
                    <select className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" onChange={(e) => setGender(e.target.value)}>
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
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
                        placeholder="+237 6--------"
                        className="h-12 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full"
                        onChange={(e) => setPhone(e.target.value)}
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
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/50"
                      onChange={(e) => setEmergencyName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">
                      Emergency Contact Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <span className="material-symbols-outlined text-lg">
                          call
                        </span>
                      </span>
                      <input
                        type="tel"
                        placeholder="+237 6--------"
                        className="h-12 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 w-full"
                        onChange={(e) => setEmergencyPhone(e.target.value)}
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
                      onChange={(e) => setAddress(e.target.value)}
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
                        onChange={(e) => setPassword_1(e.target.value)}
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
                        onChange={(e) => setPassword_2(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {
                error
                ?<div className="text-[#ff0000] text-md">{error}</div>
                : null
              }
  
              {/* ACTIONS */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-semibold hover:text-black">
                    Log in
                  </Link>
                </p>
  
                <div className="flex gap-4 w-full md:w-auto">
                  <Link to="/login">
                    <button
                      type="button"
                      className="flex-1 md:flex-none px-8 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                  </Link>
  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 h-12 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90"
                    onClick={(e) => handleSignup(e)}
                  >
                    {
                      loading ?
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                       : 
                        "Create Account"                      
                    }
                      <span className="material-symbols-outlined">
                          person_add
                      </span>
                  </button>
                </div>
              </div>
            </form>
  
          </div>
        </main>
      </div>
    );
  }
  
  export default Signup;