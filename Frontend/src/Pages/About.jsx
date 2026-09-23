import PublicNavbar from '../Components/Home/PublicNavbar.jsx';
import Footer from '../Components/Share/Footer.jsx';

export default function About() {
    return (
        <div className="p-10">

            <PublicNavbar />

            <div className="bg-white rounded-2xl shadow-xl p-10">

                {/* ============================= */}
                {/* ABOUT */}
                {/* ============================= */}

                <h1 className="text-4xl font-bold mb-6 text-blue-600">
                    About Smart_Care
                </h1>

                <p className="text-lg text-gray-700 leading-8">
                    Smart_Care is a smart doctor appointment and
                    booking system designed to make the process of
                    finding doctors and booking appointments easier
                    and more convenient for patients.

                    The system allows patients to explore available
                    doctors, check their specialization, qualification,
                    chamber schedule, and consultation fee before
                    booking an appointment.

                    Patients can select a suitable date and available
                    time slot, make the required advance payment, and
                    track their appointments through their dashboard.
                    The system also provides secure authentication
                    and role-based access for patients, doctors, and
                    administrators.
                </p>


                {/* ============================= */}
                {/* MISSION / VISION / SERVICES */}
                {/* ============================= */}

                <div className="Flex flex-col items-center justify center mt-10">

                    {/* MISSION 

                    <div className="bg-blue-100 p-6 rounded-xl">

                        <h2 className="text-2xl font-bold">
                            Mission
                        </h2>

                        <p className="mt-3">
                            Make doctor appointment booking simple,
                            convenient, and accessible through a
                            smart digital platform.
                        </p>

                    </div>


                    {/* VISIO

                    <div className="bg-green-100 p-6 rounded-xl">

                        <h2 className="text-2xl font-bold">
                            Vision
                        </h2>

                        <p className="mt-3">
                            Create a reliable and user-friendly
                            appointment booking experience that
                            connects patients with doctors efficiently.
                        </p>

                    </div>*/}


                    {/* SERVICES */}

                    <div className="bg-yellow-100 p-6 rounded-xl">

                        <h2 className="text-2xl font-bold">
                            Services
                        </h2>

                        <p className="mt-3">
                            Doctor search, appointment scheduling,
                            available time-slot checking, advance
                            payment, appointment tracking, and
                            notifications.
                        </p>

                    </div>

                </div>

            </div>

            <Footer />

        </div>
    );
}
// import PublicNavbar from '../Components/Home/PublicNavbar.jsx'
// import Footer from '../Components/Share/Footer.jsx';

// export default function About() {
//     return (
//         <div className="p-10">
//             <PublicNavbar/>
//             <div className="bg-white rounded-2xl shadow-xl p-10">
//                 <h1 className="text-4xl font-bold mb-6 text-blue-600">
//                     About Our Services
//                 </h1>

//                 <p className="text-lg text-gray-700 leading-8">
//                     Our Smart Booking Management System
//                     helps patients book
//                     appointments, manage
//                     schedules, and communicate
//                     with doctors efficiently.

//                     This system is designed to
//                     improve healthcare service
//                     digitally with secure
//                     authentication and role-based
//                     access.
//                 </p>

//                 <div className="grid md:grid-cols-3 gap-6 mt-10">
//                     <div className="bg-blue-100 p-6 rounded-xl">
//                         <h2 className="text-2xl font-bold">
//                             Mission
//                         </h2>

//                         <p className="mt-3">
//                             Provide quality healthcare
//                             digitally.
//                         </p>
//                     </div>

//                     <div className="bg-green-100 p-6 rounded-xl">
//                         <h2 className="text-2xl font-bold">
//                             Vision
//                         </h2>

//                         <p className="mt-3">
//                             Smart healthcare system
//                             for everyone.
//                         </p>
//                     </div>

//                     <div className="bg-yellow-100 p-6 rounded-xl">
//                         <h2 className="text-2xl font-bold">
//                             Services
//                         </h2>

//                         <p className="mt-3">
//                             Appointment booking,
//                             doctor management,
//                             analytics dashboard.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//             <Footer/>
//         </div>
//     );
// }