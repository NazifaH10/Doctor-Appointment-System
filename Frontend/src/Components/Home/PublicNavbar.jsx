import { Link } from "react-router-dom";
import { FaHospital, FaHome  } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { FcAbout } from "react-icons/fc";
import { MdContactPhone } from "react-icons/md";

export default function PublicNavbar() {
    return (
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white px-10 py-5 flex justify-between items-center shadow-lg rounded-t-xl">
            {/* LOGO */}
            <h1 className="text-3xl font-bold flex items-center justify-center gap-1">
                <FaHospital/>
                SmartCare
            </h1>

            {/* MENU */}
            <div className="flex gap-8 text-lg font-medium">
                <Link to="/" className="flex items-center justify-center gap-1"><FaHome />Home</Link>

                <Link to="/doctors" className="flex items-center justify-center gap-1">
                    <FaUserDoctor/>Doctors
                </Link>

                <Link to="/about" className="flex items-center justify-center gap-1">
                   <FcAbout/> About
                </Link>

                <Link to="/contact" className="flex items-center justify-center gap-1">
                   <MdContactPhone/> Contact
                </Link>
            </div>

            {/* AUTH */}
            <div className="flex gap-4">
                <Link
                    to="/login"
                    className="bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold"
                >
                    Login
                </Link>

                <Link
                    to="/register"
                    className="bg-black px-5 py-2 rounded-lg"
                >
                    Register
                </Link>
            </div>
        </div>
    );
}