import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import PrivateRoute from './Routes/Privateroute.jsx';
import MyAppointments from './Pages/MyAppointment.jsx';
import ManageUsers from "./Pages/ManageUsers.jsx";
import AdminRoute from "./Routes/Adminroute.jsx";
import Doctorroute from "./Routes/Doctorroute.jsx";
import Doctors from "./Pages/Doctors.jsx";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import { Toaster } from "react-hot-toast";
import DoctorsAppointments from './Pages/DoctorsAppoinments.jsx';
import AppointmentTable from './Components/Share/AppointmentTable.jsx';
import Error404 from './Pages/Error.jsx';
import Profile from './Pages/Profile.jsx';
import ManageDoctors from './Pages/ManageDoctors.jsx';
import Payment from './Pages/Payment.jsx';
import PhoneTest from './Pages/PhoneTest.jsx';

function App() {
  const [count, setCount] = useState(0);

  <Toaster position="top" />

  return (
    <>
      {/* <div className="h-screen flex items-center justify-center bg-gray-200">
     <h1 className="text-5xl font-bold text-blue-600">
       Hospital Management System
       </h1>
     </div> */}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/doctors" element={<Doctors />} />

          <Route path="/doctorsAppointments" element={<Doctorroute><DoctorsAppointments /></Doctorroute>} />

          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          <Route path="/myAppointment" element={<PrivateRoute><MyAppointments /></PrivateRoute>} />

          <Route path="/manageUsers" element={<AdminRoute><ManageUsers /></AdminRoute>} />

          <Route path="/manageAppointments" element={<AdminRoute><AppointmentTable /></AdminRoute>} />

          <Route path="/manageDoctors" element={<AdminRoute><ManageDoctors /></AdminRoute>} />
          <Route path="/manageDoctors/:id" element={<AdminRoute><ManageDoctors /></AdminRoute>} />

          <Route
            path="/phone-test"
            element={<PhoneTest />}
          />

          <Route
            path="/payment"
            element={<PrivateRoute><Payment /></PrivateRoute>}
          />

          <Route
            path="*"
            element={<Error404 />}
          />
        </Routes>
      </BrowserRouter>
    </>




  );
}

export default App
