import { useEffect, useState } from "react";

import {
    createUserWithEmailAndPassword,
    RecaptchaVerifier,
    PhoneAuthProvider,
    linkWithCredential,
} from "firebase/auth";

import { auth } from "../Firebase/firebase.js";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import toast, { Toaster } from "react-hot-toast";


export default function Register() {

    const navigate = useNavigate();


    // ==========================================
    // FORM DATA
    // ==========================================

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "patient",
    });


    // ==========================================
    // OTP STATES
    // ==========================================

    const [otp, setOtp] = useState("");

    const [verificationId, setVerificationId] =
        useState(null);

    const [otpSent, setOtpSent] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // CLEANUP
    // ==========================================

    useEffect(() => {

        return () => {

            if (window.recaptchaVerifier) {

                try {
                    window.recaptchaVerifier.clear();
                } catch (error) {
                    console.log(
                        "reCAPTCHA cleanup error:",
                        error
                    );
                }

                window.recaptchaVerifier = null;
            }

        };

    }, []);


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // ==========================================
    // FORMAT PHONE NUMBER
    // ==========================================

    const formatPhoneNumber = (phone) => {

        const value = phone
            .trim()
            .replace(/\s|-/g, "");


        // Firebase test number
        // +16505553434

        if (value.startsWith("+")) {

            return value;

        }


        // Bangladesh number
        // 01712345678

        if (/^01\d{9}$/.test(value)) {

            return "+880" + value.substring(1);

        }


        return null;

    };


    // ==========================================
    // SETUP RECAPTCHA
    // ==========================================

    const setupRecaptcha = async () => {

        if (window.recaptchaVerifier) {

            try {
                window.recaptchaVerifier.clear();
            } catch (error) {
                console.log(error);
            }

            window.recaptchaVerifier = null;

        }


        const verifier =
            new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "normal",

                    callback: () => {

                        console.log(
                            "Mock reCAPTCHA solved"
                        );

                    },

                    "expired-callback": () => {

                        console.log(
                            "Mock reCAPTCHA expired"
                        );

                    },
                }
            );


        window.recaptchaVerifier =
            verifier;


        await verifier.render();


        console.log(
            "Mock reCAPTCHA rendered"
        );


        return verifier;

    };


    // ==========================================
    // SEND OTP
    // ==========================================

    const sendOTP = async () => {

        try {

            setLoading(true);


            // ----------------------------------
            // VALIDATION
            // ----------------------------------

            if (!formData.name.trim()) {

                toast.error(
                    "Please enter your name."
                );

                return;
            }


            if (!formData.email.trim()) {

                toast.error(
                    "Please enter your email."
                );

                return;
            }


            if (!formData.phone.trim()) {

                toast.error(
                    "Please enter your phone number."
                );

                return;
            }


            if (formData.password.length < 6) {

                toast.error(
                    "Password must be at least 6 characters."
                );

                return;
            }


            // ----------------------------------
            // FORMAT PHONE
            // ----------------------------------

            const phoneNumber =
                formatPhoneNumber(
                    formData.phone
                );


            if (!phoneNumber) {

                toast.error(
                    "Enter a valid phone number."
                );

                return;
            }


            console.log(
                "Phone number:",
                phoneNumber
            );


            // ----------------------------------
            // CREATE RECAPTCHA
            // ----------------------------------

            const appVerifier =
                await setupRecaptcha();


            console.log(
                "App verifier:",
                appVerifier
            );


            // ----------------------------------
            // PHONE PROVIDER
            // ----------------------------------

            const phoneProvider =
                new PhoneAuthProvider(auth);


            // ----------------------------------
            // SEND PHONE OTP
            // ----------------------------------

            const id =
                await phoneProvider.verifyPhoneNumber(
                    phoneNumber,
                    appVerifier
                );


            console.log(
                "Verification ID:",
                id
            );


            setVerificationId(id);

            setOtpSent(true);


            toast.success(
                "OTP sent successfully!"
            );


        } catch (error) {

            console.error(
                "SEND OTP ERROR:",
                error
            );

            console.error(
                "ERROR CODE:",
                error.code
            );

            console.error(
                "ERROR MESSAGE:",
                error.message
            );


            if (
                window.recaptchaVerifier
            ) {

                try {

                    window.recaptchaVerifier.clear();

                } catch (clearError) {

                    console.log(
                        clearError
                    );

                }

                window.recaptchaVerifier =
                    null;

            }


            if (
                error.code ===
                "auth/invalid-phone-number"
            ) {

                toast.error(
                    "Invalid phone number."
                );

            } else {

                toast.error(
                    error.message ||
                    "Failed to send OTP."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // VERIFY OTP + CREATE ACCOUNT
    // ==========================================

    const verifyOTP = async () => {

        try {

            setLoading(true);


            if (!verificationId) {

                toast.error(
                    "Please request OTP first."
                );

                return;
            }


            if (
                !otp ||
                otp.length !== 6
            ) {

                toast.error(
                    "Please enter the 6 digit OTP."
                );

                return;
            }


            // ----------------------------------
            // CREATE PHONE CREDENTIAL
            // ----------------------------------

            const phoneCredential =
                PhoneAuthProvider.credential(
                    verificationId,
                    otp
                );


            console.log(
                "Phone credential created."
            );


            // ----------------------------------
            // CREATE EMAIL/PASSWORD ACCOUNT
            // ----------------------------------

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    formData.email.trim(),
                    formData.password
                );


            const user =
                userCredential.user;


            console.log(
                "Firebase user created:",
                user.uid
            );


            // ----------------------------------
            // LINK PHONE
            // ----------------------------------

            const linkedUser =
                await linkWithCredential(
                    user,
                    phoneCredential
                );


            console.log(
                "Phone linked:",
                linkedUser.user.phoneNumber
            );


            // ----------------------------------
            // SAVE TO MONGODB
            // ----------------------------------

            await axios.post(
                "http://localhost:5000/api/users",
                {
                    name: formData.name.trim(),

                    email: formData.email.trim(),

                    phone:
                        linkedUser.user.phoneNumber,

                    role: formData.role,
                }
            );


            // ----------------------------------
            // SUCCESS
            // ----------------------------------

            toast.success(
                "Registration Successful!"
            );


            setTimeout(() => {

                navigate("/login");

            }, 1200);


        } catch (error) {

            console.error(
                "OTP VERIFICATION ERROR:",
                error
            );

            console.error(
                "ERROR CODE:",
                error.code
            );

            console.error(
                "ERROR MESSAGE:",
                error.message
            );


            if (
                error.code ===
                "auth/invalid-verification-code"
            ) {

                toast.error(
                    "Invalid OTP."
                );

            } else if (
                error.code ===
                "auth/code-expired"
            ) {

                toast.error(
                    "OTP expired."
                );

            } else if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                toast.error(
                    "This email is already registered."
                );

            } else if (
                error.code ===
                "auth/credential-already-in-use"
            ) {

                toast.error(
                    "This phone number is already registered."
                );

            } else {

                toast.error(
                    error.message ||
                    "Registration failed."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center rounded-2xl">

            <form
                onSubmit={(e) => {

                    e.preventDefault();

                    if (!otpSent) {
                        sendOTP();
                    }

                }}

                className="bg-white p-8 rounded-xl shadow-md w-96"
            >

                <h1 className="text-3xl font-bold text-center mb-6">
                   Smart_Care Register
                </h1>


                {/* NAME */}

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    required
                    disabled={otpSent}
                    className="w-full border p-3 rounded mb-4 disabled:bg-gray-100"
                    onChange={handleChange}
                />


                {/* EMAIL */}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    required
                    disabled={otpSent}
                    className="w-full border p-3 rounded mb-4 disabled:bg-gray-100"
                    onChange={handleChange}
                />


                {/* PHONE */}

                <input
                    type="tel"
                    name="phone"
                    placeholder="01712345678"
                    value={formData.phone}
                    required
                    disabled={otpSent}
                    className="w-full border p-3 rounded mb-4 disabled:bg-gray-100"
                    onChange={handleChange}
                />


                {/* PASSWORD */}

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    required
                    disabled={otpSent}
                    className="w-full border p-3 rounded mb-4 disabled:bg-gray-100"
                    onChange={handleChange}
                />


                {/* ROLE */}

                <select
                    name="role"
                    value={formData.role}
                    disabled={otpSent}
                    className="w-full border p-3 rounded mb-4 disabled:bg-gray-100"
                    onChange={handleChange}
                >

                    <option value="patient">
                        Patient
                    </option>

                </select>


                {/* RECAPTCHA */}

                <div
                    id="recaptcha-container"
                    className="mb-4"
                ></div>


                {/* SEND OTP */}

                {!otpSent && (

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white py-3 rounded-lg hover:scale-105 transition disabled:opacity-50"
                    >

                        {loading
                            ? "Sending OTP..."
                            : "Register & Send OTP"}

                    </button>

                )}


                {/* OTP */}

                {otpSent && (

                    <div className="mt-4">

                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">

                            <p className="text-sm text-green-700">
                                OTP has been sent to:
                            </p>

                            <p className="font-semibold text-green-800">
                                {formData.phone}
                            </p>

                        </div>


                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Enter 6 digit OTP"
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value.replace(
                                        /\D/g,
                                        ""
                                    )
                                )
                            }
                            className="w-full border p-3 rounded mb-4 text-center tracking-widest text-lg"
                        />


                        <button
                            type="button"
                            onClick={verifyOTP}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >

                            {loading
                                ? "Verifying..."
                                : "Verify OTP & Complete Registration"}

                        </button>

                    </div>

                )}


                {/* LOGIN */}

                <Link to="/login">

                    <button
                        type="button"
                        className="w-full mt-3 border border-slate-900 text-slate-900 hover:text-white hover:bg-slate-900 py-3 rounded"
                    >

                        Go To Login

                    </button>

                </Link>


                <Toaster />

            </form>

        </div>

    );

}