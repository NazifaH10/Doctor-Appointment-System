import { useContext } from "react";

import {
  AuthContext,
} from "../../Context/AuthContext.jsx";
import {
  FaHospital,
  FaCalendarCheck,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/firebase.js";
import { Link, useNavigate } from "react-router-dom";
import AppointmentTable from "./AppointmentTable.jsx";
import { useState } from "react";
import { FaUsersCog } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { GrScheduleNew } from "react-icons/gr";
import { FaUserDoctor } from "react-icons/fa6";

export default function Sidebar() {

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { role } =
    useContext(AuthContext);
  // console.log(role)

  const handleLogout = async () => {
    await signOut(auth);

    navigate("/");
  };

  return (
    <>
      <div className="md:hidden h-0 bg-gradient-to-b from-blue-800 to-cyan-600 text-white my-12 ml-10 px-3 py-6 flex justify-between items-center rounded-lg">

        <button onClick={() => setOpen(!open)}>
          <FaBars size={24} />
        </button>

      </div>

      <div className={`
        bg-gradient-to-l from-slate-700 to-slate-900 rounded-lg text-white min-h-screen p-5
        fixed md:static top-0 left-0 z-50
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        <div className="flex items-center gap-3 mb-10">
          <FaHospital size={28} />

          <h1 className="text-2xl font-bold">
            SmartCare
          </h1>
        </div>

        <ul className="flex flex-col items-start">

          {/* ADMIN MENU */}
          {role === "admin" && (
            <>
              <li className="flex items-center justify-center gap-1 hover:w-full hover:bg-white hover:text-blue-600 hover:font-semibold p-3 rounded cursor-pointer transition">
               <MdDashboard size={22}/> Dashboard
              </li>

              <Link to='/manageAppointments'>
                <li className="flex items-center justify-center gap-1 hover:w-full hover:bg-white hover:text-blue-600 hover:font-semibold p-3 rounded cursor-pointer transition">
                 <FaClipboardList size={22}/> Manage Appointments
                </li>
              </Link>

              <Link to='/manageUsers'><li className="flex items-center justify-center gap-1 hover:w-full hover:bg-white hover:text-blue-600 hover:font-semibold p-3 rounded cursor-pointer transition">
              <FaUsersCog size={22}/>  Manage Users
              </li></Link>

              <Link to='/manageDoctors'><li className="flex items-center justify-center gap-1 hover:w-full hover:bg-white hover:text-blue-600 hover:font-semibold p-3 rounded cursor-pointer transition">
              <FaUserDoctor size={22}/>  Manage Doctors
              </li></Link>

              {/* <li className="hover:bg-white hover:text-blue-600 hover:font-semibold p-3 rounded cursor-pointer transition">
                Reports
              </li> */}
            </>
          )}

          {/* DOCTOR MENU */}
          {role === "doctor" && (
            <>
              {/* <li className=" hover:bg-white hover:text-blue-600 hover:font-semibold p-3 rounded cursor-pointer transition">
                Dashboard
              </li> */}

              <Link to='/doctorsAppointments'><li className="flex items-center justify-center gap-1 hover:w-full hover:bg-white hover:text-blue-600 hover:font-semibold p-3 rounded cursor-pointer transition">
               <FaClipboardList size={22}/> Appointments
              </li></Link>

              <Link to='/profile'>
                <li className="flex items-center justify-center gap-1 hover:bg-white hover:text-blue-600 hover:font-semibold p-3 rounded cursor-pointer transition">
                 <ImProfile size={22}/> Profile
                </li>
              </Link>
            </>
          )}

          {/* PATIENT MENU */}
          {role === "patient" && (
            <>
              {/* <li className="hover:bg-white hover:text-blue-600 hover:font-semibold p-3 rounded cursor-pointer transition">
                Dashboard
              </li> */}

              <li className="flex items-center justify-center gap-1 hover:w-full hover:bg-white hover:text-blue-600 hover:font-semibold p-3 rounded cursor-pointer transition">
               <GrScheduleNew size={22}/> Book Appointment
              </li>

              <Link to='/myAppointment'><li className="flex items-center justify-center gap-1 hover:w-full hover:bg-white hover:text-blue-600 hover:font-semibold p-3 rounded cursor-pointer transition">
               <FaClipboardList size={22}/> My Appointments
              </li></Link>

              <Link to='/profile'>
                <li className="flex items-center justify-center gap-1 hover:w-full hover:bg-white hover:text-blue-600 hover:font-semibold p-3 rounded cursor-pointer transition">
                 <ImProfile size={22}/> Profile
                </li>
              </Link>
            </>
          )}

        </ul>
      </div>
    </>
  );
}

// import {
//   FaHospital,
//   FaCalendarCheck,
//   FaSignOutAlt,
//   FaBars,
// } from "react-icons/fa";

// import { useState } from "react";

// export default function Sidebar() {
//   const [open, setOpen] = useState(false);

//   return (
<>
  {/* MOBILE TOPBAR */}
  {/* <div className="md:hidden bg-blue-700 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">
          Hospital
        </h1>

        <button onClick={() => setOpen(!open)}>
          <FaBars size={24} />
        </button>
      </div>

      {/* SIDEBAR */}
  {/* <div
    className={`
        bg-blue-700 text-white w-64 min-h-screen p-5
        fixed md:static top-0 left-0 z-50
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
  >
    <div className="flex items-center gap-3 mb-10">
      <FaHospital size={28} />

      <h1 className="text-2xl font-bold">
        Hospital
      </h1>
    </div>

    <ul className="space-y-4">
      <li className="hover:bg-blue-600 p-3 rounded cursor-pointer">
        Dashboard
      </li>

      <li className="hover:bg-blue-600 p-3 rounded cursor-pointer">
        Appointments
      </li>

      <li className="hover:bg-red-500 p-3 rounded cursor-pointer mt-10">
        Logout
      </li>
    </ul>
  </div> */}
</>
//   );
// }