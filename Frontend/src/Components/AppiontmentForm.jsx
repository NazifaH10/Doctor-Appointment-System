import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../Firebase/firebase.js";
import toast, { Toaster } from 'react-hot-toast';
import { useContext } from "react";
import {
  AuthContext,
} from "../Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { generateSlots } from "./Utilities/GenerateSlots.js";
import { formatTime } from "./Utilities/FormatTime.js";
import { div } from "framer-motion/client";


export default function AppointmentForm() {

  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [dailyCapacity, setDailyCapacity] =
    useState({
      appointmentCount: 0,
      maxPatients: 6,
      remainingPatients: 6,
      isFull: false,
    });

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

  useEffect(() => {
    fetchDoctors();
  }, []);

  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    appointmentDate: "",
    appointmentDay: "",
    time: "",
    problem: "",
    consultationFee: ""
  });

  // Helper of dayName
  const getDayName = (date) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return days[new Date(date).getDay()];
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectedDoctor =
    doctors.find(
      (doctor) =>
        doctor.name === formData.doctorName
    );

  const availableSlots =
    selectedDoctor
      ? generateSlots(
        selectedDoctor.startTime,
        selectedDoctor.endTime
      )
      : [];



  const fetchBookedTimes = async () => {

    if (!formData.doctorName || !formData.appointmentDate) {
      return [];
    }

    try {

      const res = await axios.get(
        "http://localhost:5000/api/appointments/booked-times",
        {
          params: {
            doctorName: formData.doctorName,
            appointmentDate: formData.appointmentDate,
          },
        }
      );

      setBookedTimes(res.data);

      return res.data;   // ⭐ IMPORTANT

    } catch (error) {

      console.log(error);

      return [];         // ⭐ IMPORTANT
    }
  };

  // =====================================================
  // FETCH DAILY APPOINTMENT CAPACITY
  // =====================================================

  const fetchDailyCapacity = async () => {

    if (
      !formData.doctorName ||
      !formData.appointmentDate
    ) {

      setDailyCapacity({
        appointmentCount: 0,
        maxPatients: 6,
        remainingPatients: 6,
        isFull: false,
      });

      return;

    }


    try {

      const res = await axios.get(
        "http://localhost:5000/api/appointments/daily-capacity",
        {
          params: {
            doctorName:
              formData.doctorName,

            appointmentDate:
              formData.appointmentDate,
          },
        }
      );


      setDailyCapacity(res.data);


    } catch (error) {

      console.log(
        "Daily Capacity Error:",
        error
      );

    }

  };

  // useEffect(() => {

  //   if (!formData.doctorName || !formData.appointmentDate) {
  //     return;
  //   }

  //   fetchBookedTimes();

  //   const interval = setInterval(() => {
  //     fetchBookedTimes();
  //   }, 2000);

  //   return () => clearInterval(interval);

  // }, [formData.doctorName, formData.appointmentDate]);

  useEffect(() => {

    if (
      !formData.doctorName ||
      !formData.appointmentDate
    ) {

      setBookedTimes([]);

      setDailyCapacity({
        appointmentCount: 0,
        maxPatients: 6,
        remainingPatients: 6,
        isFull: false,
      });

      return;

    }


    // Initial fetch
    fetchBookedTimes();

    fetchDailyCapacity();


    // Refresh every 2 seconds
    const interval = setInterval(() => {

      fetchBookedTimes();

      fetchDailyCapacity();

    }, 2000);


    return () =>
      clearInterval(interval);


  }, [
    formData.doctorName,
    formData.appointmentDate
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // -------------------------------------------------
      // CHECK DAILY LIMIT BEFORE CONTINUING
      // -------------------------------------------------

      const latestCapacity =
        await axios.get(
          "http://localhost:5000/api/appointments/daily-capacity",
          {
            params: {
              doctorName:
                formData.doctorName,

              appointmentDate:
                formData.appointmentDate,
            },
          }
        );


      if (latestCapacity.data.isFull) {

        toast.error(
          "This doctor has already reached the maximum of 6 patients for this day. Please select another date."
        );

        setDailyCapacity(
          latestCapacity.data
        );

        return;

      }

      const token = await auth.currentUser?.getIdToken();
      // console.log(token)
      if (!token) {
        alert("You are not logged in. Please login first.");
        return;
      }

      const appointmentData = {
        ...formData,
        email: user?.email,
        doctorEmail:
          selectedDoctor?.email,
        consultationFee:
          selectedDoctor?.consultationFee,
      };

      if (
        formData.time < selectedDoctor.startTime ||
        formData.time > selectedDoctor.endTime
      ) {
        toast.error(
          "Please select a time within the doctor's chamber hours."
        );
        return;
      }

      if (
        !selectedDoctor.chamberDays.includes(formData.appointmentDay)
      ) {
        toast.error(
          "Doctor is not available on this day."
        );

        return;
      }


      const latestBookedTimes = await fetchBookedTimes();

      if (latestBookedTimes.includes(formData.time)) {

        toast.error(
          "This slot has already been booked."
        );

        return;
      }

      // console.log(state);
      console.log(appointmentData);

      navigate("/payment", {
        state: {
          appointment: appointmentData,
        },
      });


      toast.success("Payment First then Your Appopintment will be Booked Successfully")

      // console.log(res.data);

      setFormData({
        patientName: "",
        doctorName: "",
        appointmentDate: "",
        appointmentDay: "",
        time: "",
        problem: "",
        consultationFee: ""
      });
    }
    // catch (error) {
    //   console.log(error);

    //   alert("Something went wrong");
    // }
    catch (error) {

      console.log("Axios Error:", error);

      console.log("Response:", error.response);

      console.log("Data:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message
      );
    }
  };



  return (
    <div className="bg-gradient-to-br from-white to-blue-100 p-6 rounded-xl shadow-xl mt-6">
      <h2 className="text-2xl font-bold mb-6">
        Book Appointment
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4"
      >
        <input
          type="text"
          placeholder="Patient Name"
          className="border p-3 rounded"
          value={formData.patientName}
          onChange={(e) =>
            setFormData({
              ...formData,
              patientName: e.target.value,
            })
          }
          required
        />

        <select
          name="doctorName"
          value={formData.doctorName}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        >
          <option value="">
            Select Doctor
          </option>

          {doctors.map((doctor) => (
            <option
              key={doctor._id}
              value={doctor.name}
            >
              {doctor.name} ({doctor.specialization})
            </option>
          ))}
        </select>

        {selectedDoctor && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
            <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
            <p><strong>Qualification:</strong> {selectedDoctor.qualification}</p>
            <p><strong>Available:</strong> {selectedDoctor.chamberDays.join(",")}</p>
            <p><strong>Time:</strong> {selectedDoctor.startTime} - {selectedDoctor.endTime}</p>
            <p><strong>Room:</strong> {selectedDoctor.roomNumber}</p>
            <p><strong>Consultation Fee:</strong> ৳{selectedDoctor.consultationFee}</p>
          </div>
        )}

        {selectedDoctor &&
          formData.appointmentDate && (

            <div
              className={`rounded-lg p-4 mt-3 border ${dailyCapacity.isFull
                ? "bg-red-50 border-red-300"
                : "bg-green-50 border-green-300"
                }`}
            >

              {dailyCapacity.isFull ? (

                <div>

                  <p className="font-bold text-red-600">
                    ⚠️ Daily Appointment Limit Reached
                  </p>

                  <p className="text-red-600 text-sm mt-1">
                    {selectedDoctor.name} has already
                    reached the maximum of 6 patients
                    for this day.
                  </p>

                  <p className="text-red-600 text-sm mt-1">
                    Please select another date.
                  </p>

                </div>

              ) : (

                <div>

                  <p className="font-bold text-green-700">
                    ✓ Appointment Availability
                  </p>

                  <p className="text-green-700 text-sm mt-1">
                    {dailyCapacity.appointmentCount}
                    {" "}of{" "}
                    {dailyCapacity.maxPatients}
                    {" "}patients booked.
                  </p>

                  <p className="text-green-700 text-sm font-semibold mt-1">
                    {dailyCapacity.remainingPatients}
                    {" "}appointment
                    {dailyCapacity.remainingPatients !== 1
                      ? "s"
                      : ""}{" "}
                    remaining for this day.
                  </p>

                </div>

              )}

            </div>

          )}



        <input
          type="date"
          name="appointmentDate"
          value={formData.appointmentDate}
          onChange={(e) => {

            const date = e.target.value;

            setFormData({
              ...formData,
              appointmentDate: date,
              appointmentDay: getDayName(date),
            });

          }}
          required
          className="border p-3 rounded"
        />



        <select
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="border p-3 rounded"
          required
          disabled={dailyCapacity.isFull}
        >
          <option value="">

            {dailyCapacity.isFull
              ? "No appointments available"
              : "Select Appointment Time"}

          </option>

          {availableSlots
            .filter(
              (slot) => !bookedTimes.includes(slot)
            )
            .map((slot) => (

              <option key={slot}
                value={slot}
              >

                {formatTime(slot)}

              </option>

            ))}
        </select>

        <textarea
          placeholder="Problem Description"
          className="border p-3 rounded"
          rows="4"
          value={formData.problem}
          onChange={(e) =>
            setFormData({
              ...formData,
              problem: e.target.value,
            })
          }
          required
        />

        <button
          type="submit"
          disabled={dailyCapacity.isFull}
          className={`bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded ${dailyCapacity.isFull
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-90"
            }`}
        >
          {dailyCapacity.isFull
            ? "Daily Limit Reached"
            : "Book Appointment"}
        </button>
        <Toaster />
      </form>
    </div>
  );
}