import { Link } from "react-router-dom";

import PublicNavbar from "../Components/Home/PublicNavbar.jsx";
import Footer from "../Components/Share/Footer.jsx";
import { FaUserDoctor } from "react-icons/fa6";
import { AiFillSchedule } from "react-icons/ai";

export default function Home() {
  return (
    <div>
      <PublicNavbar />

      {/* HERO SECTION */}
      <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center px-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          
          {/* LEFT */}
          <div>
            <h1 className="text-6xl font-bold leading-tight text-white shadow p-3 shadow-white">
              Smart Doctor Appointment
              Booking System
            </h1>

            <p className="mt-6 text-xl text-white leading-9">
              Book appointments easily,
              manage healthcare digitally,
              and connect with expert
              doctors anytime.
            </p>

            <div className="flex flex-col-reverse justify-center items-center gap-5 mt-8">
              <Link
                to="/login"
                className="flex items-center justify-center gap-1 bg-gradient-to-r from-slate-700 to-slate-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition"
              >
               <AiFillSchedule/> Book Appointment
              </Link>

              <Link
                to="/doctors"
                className="bg-white px-8 py-4 rounded-xl text-lg font-semibold shadow flex items-center justify-center gap-1"
              >
               <FaUserDoctor/> View Doctors
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <img
              src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg"
              alt=""
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>

    <Footer/>

    </div>
  );
}