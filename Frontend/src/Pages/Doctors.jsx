// // import doctors from "../data/doctor.js";

import DoctorCard from "../Components/Doctor/DoctorCard.jsx";

import PublicNavbar from "../Components/Home/PublicNavbar.jsx";
import { div } from "framer-motion/client";
import { useEffect } from "react";
import { auth } from "../Firebase/firebase.js";
import { useState } from "react";
import axios from "axios";
import Footer from "../Components/Share/Footer.jsx";

export default function Doctors() {

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");

  const specializations = [
    ...new Set(
      doctors.map((doctor) => doctor.specialization)
    ),
  ];

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

  const filteredDoctors = doctors.filter((doctor) => {

    const matchName =
      doctor.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchSpecialization =
      specialization === ""
        ? true
        : doctor.specialization === specialization;

    return matchName && matchSpecialization;

  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div>
      <PublicNavbar />
      <div className="p-6 bg-gradient-to-br from-blue-100 to-cyan-200 min-h-screen">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Our Doctors
        </h1>

        <div className="">
          <div className="flex items-center justify-center w-full gap-4 mb-8 ">

            <input
              type="text"
              placeholder="Search doctor by name..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border rounded-lg p-3 w-full"
            />

            <select
              value={specialization}
              onChange={(e) =>
                setSpecialization(e.target.value)
              }
              className="border rounded-lg p-3"
            >

              <option value="">
                All Specializations
              </option>

              {specializations.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </div></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.length === 0 ? (

            <div className="text-center py-20">

              <h2 className="text-3xl font-bold text-gray-700">
                No Doctor Found
              </h2>

              <p className="text-gray-500 mt-2 text-center">
                Try searching with another name or specialization.
              </p>

            </div>

          ) :
            (
              filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                />
              ))
            )
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Doctors() {

//   const [doctors, setDoctors] = useState([]);

//   useEffect(() => {

//     axios
//       .get("http://localhost:5000/api/doctors")
//       .then((res) => setDoctors(res.data));

//   }, []);

//   return (

//     <div className="max-w-7xl mx-auto py-12">

//       <h2 className="text-4xl font-bold text-center mb-10">
//         Our Specialist Doctors
//       </h2>

//       <div className="grid md:grid-cols-3 gap-8">

//         {doctors.map((doctor) => (

//           <div
//             key={doctor._id}
//             className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden"
//           >

//             <img
//               src={
//                 doctor.image ||
//                 "https://i.pravatar.cc/400"
//               }
//               className="w-full h-60 object-cover"
//               alt={doctor.name}
//             />

//             <div className="p-5">

//               <h3 className="text-2xl font-bold">
//                 {doctor.name}
//               </h3>

//               <p className="text-blue-600">
//                 {doctor.specialization}
//               </p>

//               <p className="mt-2">
//                 <strong>Qualification:</strong>{" "}
//                 {doctor.qualification}
//               </p>

//               <p>
//                 <strong>Experience:</strong>{" "}
//                 {doctor.experience} Years
//               </p>

//               <p>
//                 <strong>Day:</strong>{" "}
//                 {doctor.chamberDay}
//               </p>

//               <p>
//                 <strong>Time:</strong>{" "}
//                 {doctor.startTime} - {doctor.endTime}
//               </p>

//               <p>
//                 <strong>Room:</strong>{" "}
//                 {doctor.roomNumber}
//               </p>

//               <p>
//                 <strong>Fee:</strong> ৳
//                 {doctor.consultationFee}
//               </p>

//             </div>

//           </div>

//         ))}

//       </div>

//     </div>

//   );
// }