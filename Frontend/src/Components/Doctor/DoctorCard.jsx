import { Link } from "react-router-dom";
import { FaUserDoctor } from "react-icons/fa6";

export default function DoctorCard({
    doctor,
}) {
    return (
        <div className="bg-gradient-to-r from-pink-200 to-rose-300 rounded-2xl shadow-lg shadow-black p-3 w-10/12 hover:scale-105 transition-all duration-300 border-x-2 border-black">
            {/* <img
                src={doctor.image}
                alt=""
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-black"
            /> */}
            <FaUserDoctor className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-black bg-slate-100"/>

            <div className="text-center mt-4">
                <h2 className="text-2xl font-bold">
                    {doctor.name}
                </h2>

                <p className="text-white text-lg font-semibold mt-2">
                    {doctor.specialization}
                </p>

                <p className="mt-2">
                    <strong>Qualification:</strong>{" "}
                    {doctor.qualification}
                </p>

                <p>
                    <strong>Experience:</strong>{" "}
                    {doctor.experience}
                </p>

                <p>
                    <strong>Day:</strong>{" "}
                    {doctor.chamberDays.join()}
                </p>

                <p>
                    <strong>Time:</strong>{" "}
                    {doctor.startTime} - {doctor.endTime}
                </p>

                <p>
                    <strong>Room:</strong>{" "}
                    {doctor.roomNumber}
                </p>

                <p>
                    <strong>Fee:</strong> ৳
                    {doctor.consultationFee}
                </p>

                <Link to='/login'><button className="mt-5 bg-gradient-to-r from-slate-700 to-slate-900 text-white px-5 py-2 rounded-lg hover:scale-105 transition-all">
                    Book Appointment
                </button></Link>
            </div>
        </div>
    );
}