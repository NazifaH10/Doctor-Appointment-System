import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { auth } from "../Firebase/firebase.js";
import {
    FaCheckCircle,
    FaCreditCard,
    FaLock,
    FaTimes,
} from "react-icons/fa";


export default function Payment() {

    const navigate = useNavigate();

    const { state } = useLocation();

    const appointment = state?.appointment;


    // ------------------------------------------
    // STATES
    // ------------------------------------------

    const [loading, setLoading] = useState(false);

    const [selectedMethod, setSelectedMethod] =
        useState("bKash");

    const [showSuccess, setShowSuccess] =
        useState(false);

    const [transactionId, setTransactionId] =
        useState("");


    // ------------------------------------------
    // PAYMENT METHODS
    // ------------------------------------------

    const paymentMethods = [

        {
            id: "bKash",
            name: "bKash",
            logo: "/payment-logos/bkash.png",
            color: "#E2136E",
            lightColor: "#FFF0F7",
        },

        {
            id: "Nagad",
            name: "Nagad",
            logo: "/payment-logos/nagad.png",
            color: "#F7941D",
            lightColor: "#FFF5E8",
        },

        {
            id: "Rocket",
            name: "Rocket",
            logo: "/payment-logos/rocket.png",
            color: "#8E44AD",
            lightColor: "#F6EEFA",
        },

        {
            id: "Card",
            name: "Card",
            logo: "/payment-logos/visa.png",
            color: "#2563EB",
            lightColor: "#EFF6FF",
        },

    ];


    const selectedPayment =
        paymentMethods.find(
            (method) =>
                method.id === selectedMethod
        );


    // ------------------------------------------
    // NO APPOINTMENT
    // ------------------------------------------

    if (!appointment) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                <div className="bg-white p-8 rounded-xl shadow-lg text-center">

                    <h2 className="text-2xl font-bold text-red-500">
                        No Appointment Found
                    </h2>

                    <p className="text-gray-600 mt-2">
                        Please book an appointment first.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="mt-5 bg-slate-800 text-white px-6 py-3 rounded-lg"
                    >
                        Go Back
                    </button>

                </div>

            </div>

        );

    }


    // ------------------------------------------
    // HANDLE PAYMENT
    // ------------------------------------------

    const handlePayment = async () => {

        if (!selectedMethod) {

            toast.error(
                "Please select a payment method."
            );

            return;

        }


        try {

            setLoading(true);


            // --------------------------------------
            // SIMULATE PAYMENT PROCESSING
            // --------------------------------------

            await new Promise(
                (resolve) =>
                    setTimeout(resolve, 1800)
            );


            // --------------------------------------
            // GENERATE TRANSACTION ID
            // --------------------------------------

            const generatedTransactionId =
                "TXN-" +
                Date.now() +
                "-" +
                Math.floor(
                    Math.random() * 1000
                );


            setTransactionId(
                generatedTransactionId
            );


            // --------------------------------------
            // SAVE APPOINTMENT
            // --------------------------------------

            const token =
                await auth.currentUser?.getIdToken();


            if (!token) {

                toast.error(
                    "Your session has expired. Please login again."
                );

                navigate("/login");

                return;

            }


            const appointmentData = {

                ...appointment,

                paymentStatus: "Paid",

                paymentMethod:
                    selectedMethod,

                transactionId:
                    generatedTransactionId,

            };


            await axios.post(

                "http://localhost:5000/api/appointments",

                appointmentData,

                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`,

                    },

                }

            );


            // --------------------------------------
            // SHOW SUCCESS POPUP
            // --------------------------------------

            setShowSuccess(true);


        } catch (error) {

            console.log(
                "Payment Error:",
                error
            );

            console.log(
                "Response:",
                error.response?.data
            );


            toast.error(
                error.response?.data?.message ||
                "Payment failed. Please try again."
            );


        } finally {

            setLoading(false);

        }

    };


    // ------------------------------------------
    // CLOSE SUCCESS / GO TO APPOINTMENTS
    // ------------------------------------------

    const handleSuccessDone = () => {

        setShowSuccess(false);

        navigate("/myAppointment");

    };


    // ------------------------------------------
    // UI
    // ------------------------------------------

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 py-10 px-4">

            <div className="max-w-xl mx-auto">

                {/* -------------------------------- */}
                {/* PAYMENT CARD */}
                {/* -------------------------------- */}

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

                    {/* HEADER */}

                    <div
                        className="text-white px-8 py-6"
                        style={{
                            background:
                                `linear-gradient(135deg, ${selectedPayment.color}, ${selectedPayment.color}CC)`
                        }}
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <h1 className="text-3xl font-bold">
                                    Payment
                                </h1>

                                <p className="text-sm opacity-90 mt-1">
                                    Secure Appointment Payment
                                </p>

                            </div>


                            <FaLock className="text-2xl" />

                        </div>

                    </div>


                    {/* BODY */}

                    <div className="p-8">

                        {/* APPOINTMENT INFORMATION */}

                        <div className="bg-gray-50 rounded-xl p-5 mb-7">

                            <h2 className="font-bold text-lg mb-4">
                                Appointment Details
                            </h2>


                            <div className="space-y-3 text-sm">

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Doctor
                                    </span>

                                    <span className="font-semibold">
                                        {appointment.doctorName}
                                    </span>

                                </div>


                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Date
                                    </span>

                                    <span className="font-semibold">
                                        {appointment.appointmentDate}
                                    </span>

                                </div>


                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Time
                                    </span>

                                    <span className="font-semibold">
                                        {appointment.time}
                                    </span>

                                </div>


                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Consultation Fee
                                    </span>

                                    <span className="font-semibold">
                                        ৳{appointment.consultationFee}
                                    </span>

                                </div>


                                <div className="border-t pt-3 flex justify-between">

                                    <span className="font-bold text-lg">
                                        Advance Payment
                                    </span>

                                    <span
                                        className="font-bold text-xl"
                                        style={{
                                            color:
                                                selectedPayment.color
                                        }}
                                    >
                                        ৳500
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* -------------------------------- */}
                        {/* PAYMENT METHODS */}
                        {/* -------------------------------- */}

                        <h2 className="font-bold text-lg mb-4">

                            Select Payment Method

                        </h2>


                        <div className="grid grid-cols-2 gap-4">

                            {paymentMethods.map(
                                (method) => (

                                    <button

                                        type="button"

                                        key={method.id}

                                        onClick={() =>
                                            setSelectedMethod(
                                                method.id
                                            )
                                        }

                                        className="border-2 rounded-xl p-4 transition-all duration-200 flex items-center gap-3"

                                        style={{

                                            borderColor:
                                                selectedMethod ===
                                                    method.id
                                                    ? method.color
                                                    : "#E5E7EB",

                                            backgroundColor:
                                                selectedMethod ===
                                                    method.id
                                                    ? method.lightColor
                                                    : "white",

                                        }}

                                    >

                                        {/* LOGO */}

                                        <div className="w-12 h-12 flex items-center justify-center">

                                            {method.id === "Card" ? (

                                                <div
                                                    className="w-12 h-9 rounded-md flex items-center justify-center"
                                                    style={{
                                                        backgroundColor:
                                                            method.color,
                                                    }}
                                                >

                                                    <FaCreditCard
                                                        className="text-white text-xl"
                                                    />

                                                </div>

                                            ) : (

                                                <img

                                                    src={
                                                        method.logo
                                                    }

                                                    alt={
                                                        method.name
                                                    }

                                                    className="max-w-12 max-h-12 object-contain"

                                                />

                                            )}

                                        </div>


                                        {/* NAME */}

                                        <div className="text-left">

                                            <p className="font-bold">

                                                {method.name}

                                            </p>

                                            {selectedMethod ===
                                                method.id && (

                                                    <p
                                                        className="text-xs mt-1"
                                                        style={{
                                                            color:
                                                                method.color,
                                                        }}
                                                    >
                                                        Selected
                                                    </p>

                                                )}

                                        </div>

                                    </button>

                                )
                            )}

                        </div>


                        {/* -------------------------------- */}
                        {/* SELECTED PAYMENT */}
                        {/* -------------------------------- */}

                        <div
                            className="mt-6 p-4 rounded-xl flex items-center justify-between"
                            style={{
                                backgroundColor:
                                    selectedPayment.lightColor,
                                border:
                                    `1px solid ${selectedPayment.color}40`,
                            }}
                        >

                            <div>

                                <p className="text-sm text-gray-500">

                                    Paying with

                                </p>

                                <p
                                    className="font-bold text-lg"
                                    style={{
                                        color:
                                            selectedPayment.color,
                                    }}
                                >

                                    {selectedPayment.name}

                                </p>

                            </div>


                            <p
                                className="font-bold text-xl"
                                style={{
                                    color:
                                        selectedPayment.color,
                                }}
                            >
                                ৳500
                            </p>

                        </div>


                        {/* -------------------------------- */}
                        {/* PAY BUTTON */}
                        {/* -------------------------------- */}

                        <button

                            type="button"

                            onClick={handlePayment}

                            disabled={loading}

                            className="w-full mt-7 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-60"

                            style={{
                                backgroundColor:
                                    selectedPayment.color,
                            }}

                        >

                            {loading ? (

                                <span>
                                    Processing Payment...
                                </span>

                            ) : (

                                <span>
                                    Pay ৳500 with{" "}
                                    {selectedPayment.name}
                                </span>

                            )}

                        </button>


                        {/* SECURITY MESSAGE */}

                        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-5">

                            <FaLock />

                            Secure Payment • Smart Booking System

                        </div>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* SUCCESS POPUP */}
            {/* ================================================= */}

            {showSuccess && (

                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">

                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeIn_0.3s_ease-out]">


                        {/* SUCCESS HEADER */}

                        <div
                            className="p-7 text-center text-white"
                            style={{
                                background:
                                    `linear-gradient(135deg, ${selectedPayment.color}, ${selectedPayment.color}CC)`
                            }}
                        >

                            <div className="flex justify-end">

                                <button
                                    onClick={handleSuccessDone}
                                    className="text-white/80 hover:text-white"
                                >

                                    <FaTimes />

                                </button>

                            </div>


                            <div className="flex justify-center mb-4">

                                <div className="bg-white rounded-full p-3">

                                    <FaCheckCircle
                                        className="text-5xl"
                                        style={{
                                            color:
                                                selectedPayment.color
                                        }}
                                    />

                                </div>

                            </div>


                            <h2 className="text-2xl font-bold">

                                Payment Successful!

                            </h2>

                            <p className="text-sm opacity-90 mt-2">

                                Your payment has been completed successfully.

                            </p>

                        </div>


                        {/* SUCCESS BODY */}

                        <div className="p-7">


                            <div className="bg-gray-50 rounded-xl p-5 space-y-4">


                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Payment Method
                                    </span>

                                    <span
                                        className="font-bold"
                                        style={{
                                            color:
                                                selectedPayment.color
                                        }}
                                    >
                                        {selectedPayment.name}
                                    </span>

                                </div>


                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Amount Paid
                                    </span>

                                    <span className="font-bold">
                                        ৳500
                                    </span>

                                </div>


                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Transaction ID
                                    </span>

                                    <span className="font-semibold text-xs">
                                        {transactionId}
                                    </span>

                                </div>


                                <div className="border-t pt-4">

                                    <div className="flex justify-between">

                                        <span className="text-gray-500">
                                            Doctor
                                        </span>

                                        <span className="font-semibold">
                                            {appointment.doctorName}
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* DONE BUTTON */}

                            <button

                                onClick={handleSuccessDone}

                                className="w-full mt-6 text-white py-3 rounded-xl font-bold transition-all"

                                style={{
                                    backgroundColor:
                                        selectedPayment.color,
                                }}

                            >

                                Continue to My Appointments

                            </button>


                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}
