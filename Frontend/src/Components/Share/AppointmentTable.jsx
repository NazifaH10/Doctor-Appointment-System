import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../Firebase/firebase.js";
import toast, { Toaster } from 'react-hot-toast';
import { motion } from "framer-motion";
import DashboardChart from "../Dashboard/DashboardCharts.jsx";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AppointmentTable() {
  const [appointments, setAppointments] = useState([]);

  const [search, setSearch] = useState("");

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
      console.log(appointments)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/appointments/${id}`
      );

      // alert("Appointment Deleted");
      toast.success("Appointment Deleted Successfully")

      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  // STATUS UPDATE
  const handleStatus = async (id, status) => {

    // const token = await auth.currentUser?.getIdToken();
    // // console.log(token)
    // if (!token) {
    //   alert("You are not logged in. Please login first.");
    //   return;
    // }

    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${id}`,
        {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
          status
        },
        // { status }
      );

      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="bg-gradient-to-br from-white to-slate-400 p-6 rounded-xl shadow mt-5">

      <div className="flex">
        <Link to='/dashboard'><button className="bg-black text-white text-2xl p-3 rounded-md"><FaRegArrowAltCircleLeft /></button></Link>
      </div>

      <div className="w-full flex items-center justify-between mt-5">
        <h2 className=" text-xl text-center font-bold mb-6">
          Appointment List
        </h2>
        <input
          type="text"
          placeholder="Search patient or doctor..."
          className="border p-3 rounded mb-4 w-96"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse ">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-3 text-center">
                Patient
              </th>

              <th className="p-3 text-center">
                Doctor
              </th>

              <th className="p-3 text-center">
                Date
              </th>

              <th className="p-3 text-center">
                Time
              </th>

              <th className="p-3 text-center">
                Problem
              </th>

              <th className="p-3 text-center">
                Status
              </th>

              <th className="p-3 text-center">
                Payment Status
              </th>

              <th className="p-3 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {appointments
              .filter((item) =>
                item.patientName
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                item.doctorName
                  .toLowerCase()
                  .includes(search.toLowerCase())
              ).map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">
                    {item.patientName}
                  </td>

                  <td className="p-3">
                    {item.doctorName}
                  </td>

                  <td className="p-3">
                    {item.appointmentDate}
                  </td>

                  <td className="p-3">
                    {item.time}
                  </td>

                  <td className="p-3">
                    {item.problem}
                  </td>

                  <td className="p-3">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatus(
                          item._id,
                          e.target.value
                        )
                      }
                      className="border p-2 rounded"
                    >
                      <option value="pending" className="">
                        Pending
                      </option>

                      <option value="approved">
                        Approved
                      </option>

                      <option value="completed">
                        Completed
                      </option>
                    </select>
                  </td>

                  <td>
                    {
                      item.paymentStatus == "Paid"
                        ?

                        <span className="bg-green-500 text-white px-3 py-1 rounded-full">

                          Paid

                        </span>

                        :

                        <span className="bg-red-500 text-white px-3 py-1 rounded-full">

                          Pending

                        </span>

                    }
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        handleDelete(item._id)
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                    <Toaster />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div >
  );
}