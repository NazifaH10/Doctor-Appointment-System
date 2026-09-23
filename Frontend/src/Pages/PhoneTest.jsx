import { useState } from "react";

import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "../Firebase/firebase.js";


export default function PhoneTest() {

    const [phone, setPhone] = useState("");

    const [otp, setOtp] = useState("");

    const [confirmationResult, setConfirmationResult] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);



    // ==========================================
    // SEND OTP
    // ==========================================

    const sendOTP = async () => {

        try {

            setLoading(true);

            setMessage("");


            if (!phone.trim()) {

                setMessage(
                    "Please enter the Firebase test phone number."
                );

                return;

            }


            console.log(
                "Test phone:",
                phone
            );

            // ==========================================
            // CREATE TEST reCAPTCHA
            // ==========================================

            const setupRecaptcha = async () => {

                // If verifier already exists,
                // use the existing one.

                if (window.recaptchaVerifier) {
                    return window.recaptchaVerifier;
                }


                const verifier =
                    new RecaptchaVerifier(
                        auth,
                        "recaptcha-container",
                        {
                            size: "normal",

                            callback: () => {

                                console.log(
                                    "Test reCAPTCHA solved"
                                );

                            },

                            "expired-callback": () => {

                                console.log(
                                    "Test reCAPTCHA expired"
                                );

                            },
                        }
                    );


                window.recaptchaVerifier =
                    verifier;


                // Render the mock reCAPTCHA

                await verifier.render();


                return verifier;
            };


            // Create test reCAPTCHA

            const appVerifier =
                await setupRecaptcha();


            console.log(
                "App verifier ready:",
                appVerifier
            );


            // IMPORTANT:
            // Third argument is required.

            const result =
                await signInWithPhoneNumber(
                    auth,
                    phone,
                    appVerifier
                );


            console.log(
                "Confirmation result:",
                result
            );


            setConfirmationResult(
                result
            );


            setMessage(
                "Test OTP is ready. Enter the code configured in Firebase."
            );


        } catch (error) {

            console.error(
                "PHONE AUTH ERROR:",
                error
            );

            console.error(
                "CODE:",
                error.code
            );

            console.error(
                "MESSAGE:",
                error.message
            );


            setMessage(
                error.message ||
                "Phone authentication failed."
            );


            // Reset reCAPTCHA after error

            if (window.recaptchaVerifier) {

                try {

                    window.recaptchaVerifier.clear();

                } catch (clearError) {

                    console.log(
                        "reCAPTCHA clear error:",
                        clearError
                    );

                }

                window.recaptchaVerifier =
                    null;
            }


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // VERIFY OTP
    // ==========================================

    const verifyOTP = async () => {

        try {

            setLoading(true);

            setMessage("");


            if (!confirmationResult) {

                setMessage(
                    "Please send OTP first."
                );

                return;

            }


            if (!otp || otp.length !== 6) {

                setMessage(
                    "Please enter the 6 digit test OTP."
                );

                return;

            }


            console.log(
                "Verifying OTP:",
                otp
            );


            const result =
                await confirmationResult.confirm(
                    otp
                );


            console.log(
                "Firebase User:",
                result.user
            );


            console.log(
                "UID:",
                result.user.uid
            );


            console.log(
                "Phone:",
                result.user.phoneNumber
            );


            setMessage(
                "Phone authentication successful!"
            );


        } catch (error) {

            console.error(
                "OTP ERROR:",
                error
            );

            console.error(
                "CODE:",
                error.code
            );

            console.error(
                "MESSAGE:",
                error.message
            );


            setMessage(
                error.message ||
                "OTP verification failed."
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-lg w-96">

                <h1 className="text-2xl font-bold mb-6 text-center">

                    Phone Authentication Test

                </h1>


                {/* PHONE */}

                <input
                    type="text"
                    placeholder="+16505553434"
                    value={phone}
                    onChange={(e) =>
                        setPhone(e.target.value)
                    }
                    className="w-full border p-3 rounded mb-4"
                />


                {/* TEST RECAPTCHA */}

                <div
                    id="recaptcha-container"
                    className="mb-4"
                ></div>


                {/* SEND OTP */}

                <button
                    type="button"
                    onClick={sendOTP}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded mb-4 disabled:opacity-50"
                >

                    {loading
                        ? "Processing..."
                        : "Send OTP"}

                </button>


                {/* OTP */}

                <input
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    placeholder="Enter Test OTP"
                    value={otp}
                    onChange={(e) =>
                        setOtp(
                            e.target.value.replace(
                                /\D/g,
                                ""
                            )
                        )
                    }
                    className="w-full border p-3 rounded mb-4"
                />


                {/* VERIFY */}

                <button
                    type="button"
                    onClick={verifyOTP}
                    disabled={loading}
                    className="w-full bg-green-600 text-white p-3 rounded disabled:opacity-50"
                >

                    {loading
                        ? "Verifying..."
                        : "Verify OTP"}

                </button>


                {/* MESSAGE */}

                {message && (

                    <p className="mt-4 text-sm text-center">

                        {message}

                    </p>

                )}

            </div>

        </div>

    );

}