import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import PatientProfile from "./pages/PatientProfile/PatientProfile";
import PatientDashBoard from "./pages/PatientDashBoard/PatientDashBoard";
import EditPatient from "./pages/EditPatient/EditPatient";
import AppointmentList from "./pages/AppointmentList/AppointmentList";
import CreateAppointment from "./pages/CreateAppointment/CreateAppointment";
import MedicalContent from "./pages/MedicalContent/MedicalContent";
import MedicalDetails from "./pages/MedicalDetails/MedicalDetails";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Unauthorized from "./pages/Unauthorized/Unauthorized";

function App() {

  return (
    <main>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/" element={<PatientDashBoard />}></Route>
        <Route path="/home" element={<PatientDashBoard />}></Route>
        <Route path="/patient-profile" element={<PatientProfile />}></Route>
        <Route path="/edit-profile" element={<EditPatient />}></Route>
        <Route path="/appointments" element={<AppointmentList />}></Route>
        <Route path="/create-appointment" element={<CreateAppointment />}></Route>
        <Route path="/medical-content" element={<MedicalContent />}></Route>
        <Route path="/medical-details" element={<MedicalDetails />}></Route>
        <Route path="/unauthorized" element={<Unauthorized />}></Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes roleProps={"patient"} />}>
        </Route>
      </Routes>
    </main>
  )
}

export default App
