import {
    useContext,
    useEffect,
    useState,
} from "react";
import { auth } from "../Firebase/firebase.js";

import axios from "axios";

import {
    AuthContext,
} from "../Context/AuthContext.jsx";
import { Link } from "react-router-dom";
import { FaRegArrowAltCircleLeft  } from "react-icons/fa";

export default function MyAppointments() {
    const { user } =
        useContext(AuthContext);

    const [appointments, setAppointments] =
        useState([]);

    useEffect(() => {
        const fetchAppointments =
            async () => {
                try {

                    const token = await auth.currentUser?.getIdToken();
                    // console.log(token)
                    if (!token) {
                        alert("You are not logged in. Please login first.");
                        return;
                    }

                    const res =
                        await axios.get(
                            "http://localhost:5000/api/appointments",
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                    const myData =
                        res.data.filter(
                            (item) =>
                                item.email ===
                                user?.email
                        );

                    setAppointments(myData);
                } catch (error) {
                    console.log(error);
                }
            };

        fetchAppointments();
    }, [user]);

    return (
        <div className="p-6">

            <div className="flex">
                <Link to='/dashboard'><button className="bg-black text-white text-2xl p-3 rounded-md"><FaRegArrowAltCircleLeft  /></button></Link>
            </div>

            <h1 className="text-3xl font-bold mb-6">
                My Appointments
            </h1>

            <div className="grid gap-1">
                {appointments.map((item) => (
                    <div
                        key={item._id}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3 rounded-xl shadow flex flex-row justify-evenly items-center"
                    >
                        <h2 className="text-xl font-bold">
                            Doctor Name : {item.doctorName}
                        </h2>

                        <p>
                            Date : {item.appointmentDate}
                        </p>

                        <p>
                            Day : {item.appointmentDay}
                        </p>

                        <p>
                            Time : {item.time}
                        </p>

                        <p>
                            Status : {item.status}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}