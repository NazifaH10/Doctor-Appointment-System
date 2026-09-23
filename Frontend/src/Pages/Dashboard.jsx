import Sidebar from "../Components/Share/Sidebar.jsx";
import Navbar from "../Components/Share/Navbar";
import AppointmentForm from "../Components/AppiontmentForm.jsx";
import AppointmentTable from "../Components/Share/AppointmentTable";

import useUserRole from "../hooks/useUserRole.js";
import AppointmentChart from "../Components/Share/AppointmentChart.jsx";
import Footer from "../Components/Share/Footer.jsx";

export default function Dashboard() {
  const role = useUserRole();

  return (
    <div className="flex bg-gradient-to-br from-slate-100 to-blue-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <Navbar />

        {/* <div className="bg-white p-6 rounded-xl shadow mt-6">
          <h1 className="text-3xl font-bold">
            Welcome {role}
          </h1>
        </div> */}

        {/* PATIENT */}
        {role === "patient" && (
          <AppointmentForm />
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <AppointmentChart/>
        )}

        {/* DOCTOR */}
        {role === "doctor" && (
          <div className="bg-white p-6 rounded-xl shadow mt-6">
            <h2 className="text-2xl font-bold">
              Doctor Panel
            </h2>

            <p className="mt-3">
              View assigned appointments here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}