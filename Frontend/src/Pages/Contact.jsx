import PublicNavbar from "../Components/Home/PublicNavbar.jsx";

import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
} from "react-icons/fa";

import toast from "react-hot-toast";
import Footer from "../Components/Share/Footer.jsx";

export default function Contact() {

    // HANDLE FORM
    const handleSubmit = (e) => {
        e.preventDefault();

        toast.success("Message Sent Successfully!");
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-100 min-h-screen">

            {/* NAVBAR */}
            <PublicNavbar />

            {/* HEADER */}
            <div className="text-center py-16 px-6">
                <h1 className="text-5xl font-bold text-blue-700">
                    Contact Us
                </h1>

                <p className="mt-5 text-gray-700 text-lg max-w-2xl mx-auto leading-8">
                    We are always ready to help you.
                    Contact with us for appointments,
                    emergency support, and healthcare services.
                </p>
            </div>

            {/* MAIN SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-8 lg:px-20 pb-20">

                {/* LEFT CONTACT INFO */}
                <div className="bg-white rounded-3xl shadow-2xl p-10">

                    <h2 className="text-3xl font-bold text-blue-700 mb-10">
                        Our Information
                    </h2>

                    {/* PHONE */}
                    <div className="flex items-start gap-5 mb-8">
                        <div className="bg-blue-100 p-4 rounded-full">
                            <FaPhoneAlt className="text-blue-700 text-2xl" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold">
                                Phone Number
                            </h3>

                            <p className="text-gray-600 mt-2">
                                +880 1234-567890
                            </p>
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div className="flex items-start gap-5 mb-8">
                        <div className="bg-green-100 p-4 rounded-full">
                            <FaEnvelope className="text-green-700 text-2xl" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-left">
                                Email Address
                            </h3>

                            <p className="text-gray-600 mt-2 text-left">
                                Smartcare@gmail.com
                            </p>
                        </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="flex items-start gap-5 mb-8">
                        <div className="bg-yellow-100 p-4 rounded-full">
                            <FaMapMarkerAlt className="text-yellow-700 text-2xl" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-left">Address</h3>

                            <p className="text-gray-600 mt-2">
                                Chattogram, Bangladesh
                            </p>
                        </div>
                    </div>

                    {/* TIME */}
                    <div className="flex items-start gap-5">
                        <div className="bg-red-100 p-4 rounded-full">
                            <FaClock className="text-red-700 text-2xl" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-left">
                                Working Hours
                            </h3>

                            <p className="text-gray-600 mt-2">
                                24/7 Emergency Service
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTACT FORM */}
                <div className="bg-white rounded-3xl shadow-2xl p-10">

                    <h2 className="text-3xl font-bold text-blue-700 mb-10">
                        Send Message
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* NAME */}
                        <div>
                            <label className="block mb-2 font-semibold">
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                required
                                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="block mb-2 font-semibold">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                required
                                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* SUBJECT */}
                        <div>
                            <label className="block mb-2 font-semibold">
                                Subject
                            </label>

                            <input
                                type="text"
                                placeholder="Enter subject"
                                required
                                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* MESSAGE */}
                        <div>
                            <label className="block mb-2 font-semibold">
                                Message
                            </label>

                            <textarea
                                rows="5"
                                placeholder="Write your message..."
                                required
                                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl text-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <Footer />
            {/* MAP SECTION */}
            {/* <div className="px-8 lg:px-20 pb-20">

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

                    <iframe
                        title="Hospital Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.870066630417!2d91.7832!3d22.3569!2m3!1f0!2f0!3f0!"
                        width="100%"
                        height="400"
                        allowFullScreen=""
                        loading="lazy"
                        className="border-0"
                    ></iframe>
                </div>
            </div> */}
        </div>
    );
}