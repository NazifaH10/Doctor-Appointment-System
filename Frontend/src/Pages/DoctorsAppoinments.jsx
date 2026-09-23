import { useEffect, useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../Context/AuthContext.jsx";
import { auth } from '../Firebase/firebase.js'
import { Link } from "react-router-dom";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import Loader from "../Components/Share/Loader.jsx";

export default function DoctorAppointments() {
    const { user, dbUser } = useContext(AuthContext);

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const token = await auth.currentUser?.getIdToken();

            if (!token) {
                alert("You are not logged in. Please login first.");
                return;
            }

            const res = await axios.get(
                "http://localhost:5000/api/appointments",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Filter by Doctor Name
            const doctorAppointments = res.data.filter(
                (appointment) =>
                    appointment.doctorName === dbUser?.name
            );
            // console.log(user?.displayName);
            // console.log(res.data);
            setAppointments(doctorAppointments);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && dbUser) {
            // console.log(dbUser);
            fetchAppointments();
        }
    }, [user]);

    // const fetchAppointments =
    //     async () => {
    //         try {
    //             const token = await auth.currentUser?.getIdToken();

    //                     if (!token) {
    //                         alert("You are not logged in. Please login first.");
    //                         return;
    //                     }

    //             const res =
    //                 await axios.get(
    //                     `http://localhost:5000/api/appointments/doctor/${user?.email}`,
    //                     {
    //                         headers: {
    //                             Authorization:
    //                                 `Bearer ${token}`,
    //                         },
    //                     }
    //                 );
    //             console.log(res.data)
    //             setAppointments(
    //                 res.data
    //             );
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };

    const updateStatus = async (id, status) => {
        try {
            const token =
                await user.getIdToken();

            await axios.put(
                `http://localhost:5000/api/appointments/${id}`,
                { status },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            toast.success(`Appointment ${status}`);

            fetchAppointments();
        } catch (error) {
            console.log(error);
            toast.error("Failed to update");
        }
    };

    if (loading) {
        return (
            <Loader />
        );
    }

    return (
        <div className="p-6">

            <div className="flex">
                <Link to='/dashboard'><button className="bg-black text-white text-2xl p-3 rounded-md"><FaRegArrowAltCircleLeft /></button></Link>
            </div>

            <h1 className="text-3xl font-bold mb-6">
                Doctor Appointments
            </h1>

            {appointments.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow">
                    No appointments found.
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow">

                    <table className="w-full">

                        <thead className="bg-blue-600 text-white">

                            <tr>
                                <th className="p-4">Patient</th>
                                <th className="p-4">Doctor</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Time</th>
                                <th className="p-4">Problem</th>
                                <th className="p-4">Status</th>
                                {/* <th className="p-4">Action</th> */}
                            </tr>

                        </thead>

                        <tbody>

                            {appointments.map((appointment) => (

                                <tr
                                    key={appointment._id}
                                    className="border-b"
                                >
                                    <td className="p-4">
                                        {appointment.patientName}
                                    </td>

                                    <td className="p-4">
                                        {appointment.doctorName}
                                    </td>

                                    <td className="p-4">
                                        {appointment.date}
                                    </td>

                                    <td className="p-4">
                                        {appointment.time}
                                    </td>

                                    <td className="p-4">
                                        {appointment.problem}
                                    </td>

                                    <td className="p-4">

                                        {appointment.status === "pending" && (
                                            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full">
                                                Pending
                                            </span>
                                        )}

                                        {appointment.status === "approved" && (
                                            <span className="bg-green-500 text-white px-3 py-1 rounded-full">
                                                Approved
                                            </span>
                                        )}

                                        {appointment.status === "completed" && (
                                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full">
                                                Completed
                                            </span>
                                        )}

                                    </td>

                                    {/* <td className="p-4 flex gap-2">

                                        {appointment.status === "pending" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        appointment._id,
                                                        "approved"
                                                    )
                                                }
                                                className="bg-green-600 text-white px-3 py-1 rounded"
                                            >
                                                Approve
                                            </button>
                                        )}

                                        {appointment.status === "approved" && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        appointment._id,
                                                        "completed"
                                                    )
                                                }
                                                className="bg-blue-600 text-white px-3 py-1 rounded"
                                            >
                                                Complete
                                            </button>
                                        )}

                                    </td> */}

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
}