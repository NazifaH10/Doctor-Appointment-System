import { FaHospital, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-slate-700 to-slate-900 text-white  rounded-b-xl">
            <div className="max-w-7xl mx-auto px-6 py-10">

                <div className="grid md:grid-cols-3 gap-8">

                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <FaHospital />
                            SmartCare
                        </h2>

                        <p className="mt-3 text-gray-400">
                            Modern booking appointment and management
                            system built with React, Node.js,
                            MongoDB and Firebase.
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <h3 className="font-semibold text-lg mb-3">
                            Contact
                        </h3>

                        <p className="flex items-center gap-2">
                            <FaPhone /> +880 1XXXXXXXXX
                        </p>

                        <p className="flex items-center gap-2 mt-2">
                            <FaEnvelope /> smartcare@gmail.com
                        </p>

                        <p className="flex items-center gap-2 mt-2">
                            <FaMapMarkerAlt /> Chattogram, Bangladesh
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-3">
                            Developer
                        </h3>

                        <p>Nazifa Hurain</p>
                        <p>CSE Department</p>
                        <p>Chittagong Independent University</p>
                    </div>

                </div>

                <hr className="my-6 border-gray-700" />

                <p className="text-center text-gray-400">
                    © 2026 Smart Booking System.
                    All Rights Reserved.
                </p>

            </div>
        </footer>
    );
}