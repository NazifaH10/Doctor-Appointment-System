import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import DashboardChart from "../Dashboard/DashboardCharts.jsx";
import { auth } from "../../Firebase/firebase.js";
import { FaUsers, FaHourglassEnd } from "react-icons/fa";
import { FaUserDoctor, FaFileWaveform } from "react-icons/fa6";
import { MdSick, MdOutlinePendingActions  } from "react-icons/md";
import { FcApprove } from "react-icons/fc";

export default function AppointmentChart(params) {

    const [appointments, setAppointments] = useState([]);

    const [doctors, setDoctors] = useState([]);

    const [users, setUsers] = useState([]);

    const [patients, setPatients] = useState([]);

    // FETCH PATIENT
    const fetchPatients = async () => {
        try {

            const token = await auth.currentUser?.getIdToken();

            const res = await axios.get(
                "http://localhost:5000/api/users/patients",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // console.log(res.data);
            setPatients(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    // FETCH USERS
    const fetchUsers = async () => {
        try {
            const res =
                await axios.get(
                    "http://localhost:5000/api/users"
                );

            setUsers(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchDoctors = async () => {
        try {

            // const token = await auth.currentUser?.getIdToken();

            const res = await axios.get(
                "http://localhost:5000/api/doctors",
                // {
                //   headers: {
                //     Authorization: `Bearer ${token}`,
                //   },
                // }
            );

            setDoctors(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAppointments = async () => {

        const token = await auth.currentUser?.getIdToken();
        // console.log(token)
        if (!token) {
            alert("You are not logged in. Please login first.");
            return;
        }

        try {
            const res = await axios.get(
                "http://localhost:5000/api/appointments",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAppointments(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchPatients();
        fetchAppointments();
        fetchDoctors();
    }, []);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-6 bg-blue-100 p-5 rounded-lg">

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-emerald-400 to-teal-600 text-white p-6 rounded-xl shadow-lg"
                >
                    <h2 className="text-xl font-bold">
                        <FaUsers />Total Users
                    </h2>

                    <p className="text-4xl font-bold mt-4">
                        {users.length}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-pink-300 to-red-400 text-black p-6 rounded-xl shadow-lg"
                >
                    <h2 className="text-xl font-bold">
                        <FaUserDoctor />  Total Doctors
                    </h2>

                    <p className="text-4xl font-bold mt-4">
                        {doctors.length}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white p-6 rounded-xl shadow-lg"
                >
                    <h2 className="text-xl font-bold">
                        <MdSick /> Total Patients
                    </h2>

                    <p className="text-4xl font-bold mt-4">
                        {patients.length}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg"
                >
                    <h2 className="text-xl font-bold">
                        <FaFileWaveform /> Total Appointments
                    </h2>

                    <p className="text-4xl font-bold mt-4">
                        {appointments.length}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow-lg"
                >
                    <h2 className="text-xl font-bold">
                       <FcApprove/> Approved
                    </h2>

                    <p className="text-4xl font-bold mt-4">
                        {
                            appointments.filter(
                                (a) => a.status === "approved"
                            ).length
                        }
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-lg"
                >
                    <h2 className="text-xl font-bold">
                       <MdOutlinePendingActions /> Pending
                    </h2>

                    <p className="text-4xl font-bold mt-4">
                        {
                            appointments.filter(
                                (a) => a.status === "pending"
                            ).length
                        }
                    </p>
                </motion.div>
            </div>

            <div className="my-10">
                <DashboardChart appointments={appointments} />
            </div>

        </div>
    )
}