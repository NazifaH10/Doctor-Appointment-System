import { useEffect, useState } from "react";

import {
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

import { auth } from "../Firebase/firebase.js";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast, {
  Toaster,
} from "react-hot-toast";


export default function Login() {

  const navigate = useNavigate();


  // ==========================================
  // LOGIN METHOD
  // ==========================================

  const [loginMethod, setLoginMethod] =
    useState("email");


  // ==========================================
  // EMAIL LOGIN
  // ==========================================

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });


  // ==========================================
  // PHONE LOGIN
  // ==========================================

  const [phone, setPhone] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [confirmationResult, setConfirmationResult] =
    useState(null);

  const [otpSent, setOtpSent] =
    useState(false);


  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // CLEANUP RECAPTCHA
  // ==========================================

  useEffect(() => {

    return () => {

      if (window.recaptchaVerifier) {

        try {

          window.recaptchaVerifier.clear();

        } catch (error) {

          console.log(error);

        }

        window.recaptchaVerifier = null;

      }

    };

  }, []);


  // ==========================================
  // FORMAT PHONE NUMBER
  // ==========================================

  const formatPhoneNumber = (phone) => {

    const value = phone
      .trim()
      .replace(/\s|-/g, "");


    // Already international format

    if (value.startsWith("+")) {

      return value;

    }


    // Bangladesh number

    // 01712345678
    // ↓
    // +8801712345678

    if (/^01\d{9}$/.test(value)) {

      return "+880" +
        value.substring(1);

    }


    return null;

  };


  // ==========================================
  // SETUP RECAPTCHA
  // ==========================================

  const setupRecaptcha = async () => {

    // Remove previous verifier

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
              "reCAPTCHA solved"
            );

          },

          "expired-callback": () => {

            console.log(
              "reCAPTCHA expired"
            );

          },

        }
      );


    window.recaptchaVerifier =
      verifier;


    await verifier.render();


    return verifier;

  };


  // ==========================================
  // EMAIL LOGIN
  // ==========================================

  const handleEmailLogin =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);


        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );


        toast.success(
          "Login Successful!"
        );


        navigate("/dashboard");


      } catch (error) {

        console.log(error);


        toast.error(
          error.message ||
          "Login failed."
        );


      } finally {

        setLoading(false);

      }

    };


  // ==========================================
  // SEND PHONE OTP
  // ==========================================

  const handleSendOTP =
    async () => {

      try {

        setLoading(true);


        // --------------------------------------
        // VALIDATE PHONE
        // --------------------------------------

        if (!phone.trim()) {

          toast.error(
            "Please enter your phone number."
          );

          return;

        }


        // --------------------------------------
        // FORMAT PHONE
        // --------------------------------------

        const phoneNumber =
          formatPhoneNumber(phone);


        if (!phoneNumber) {

          toast.error(
            "Enter a valid Bangladesh phone number."
          );

          return;

        }


        console.log(
          "Phone:",
          phoneNumber
        );


        // --------------------------------------
        // RECAPTCHA
        // --------------------------------------

        const appVerifier =
          await setupRecaptcha();


        // --------------------------------------
        // SEND OTP
        // --------------------------------------

        const result =
          await signInWithPhoneNumber(
            auth,
            phoneNumber,
            appVerifier
          );


        setConfirmationResult(
          result
        );

        setOtpSent(true);


        toast.success(
          "OTP sent successfully!"
        );


      } catch (error) {

        console.error(
          "PHONE LOGIN ERROR:",
          error
        );


        console.error(
          "ERROR CODE:",
          error.code
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

        } else if (
          error.code ===
          "auth/user-not-found"
        ) {

          toast.error(
            "No account is registered with this phone number."
          );

        } else if (
          error.code ===
          "auth/too-many-requests"
        ) {

          toast.error(
            "Too many attempts. Please try again later."
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
  // VERIFY OTP
  // ==========================================

  const handleVerifyOTP =
    async () => {

      try {

        setLoading(true);


        if (!confirmationResult) {

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


        // --------------------------------------
        // VERIFY OTP
        // --------------------------------------

        await confirmationResult.confirm(
          otp
        );


        toast.success(
          "Login Successful!"
        );


        // --------------------------------------
        // GO DASHBOARD
        // --------------------------------------

        navigate("/dashboard");


      } catch (error) {

        console.error(
          "OTP VERIFICATION ERROR:",
          error
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
            "OTP expired. Please request a new OTP."
          );

        } else {

          toast.error(
            error.message ||
            "OTP verification failed."
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

    <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center rounded-2xl px-4">

      <form
        onSubmit={
          loginMethod === "email"
            ? handleEmailLogin
            : (e) => e.preventDefault()
        }
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >

        {/* ================================= */}
        {/* TITLE */}
        {/* ================================= */}

        <h1 className="text-3xl font-bold text-center mb-6">

          Smart_Care Login

        </h1>


        {/* ================================= */}
        {/* LOGIN METHOD */}
        {/* ================================= */}

        <div className="flex gap-2 mb-6">

          <button
            type="button"
            onClick={() => {

              setLoginMethod("email");

              setOtpSent(false);

            }}
            className={`w-1/2 py-3 rounded-lg font-semibold transition ${
              loginMethod === "email"
                ? "bg-slate-800 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >

            Email Login

          </button>


          <button
            type="button"
            onClick={() => {

              setLoginMethod("phone");

              setOtpSent(false);

            }}
            className={`w-1/2 py-3 rounded-lg font-semibold transition ${
              loginMethod === "phone"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >

            Phone Login

          </button>

        </div>


        {/* ================================= */}
        {/* EMAIL LOGIN */}
        {/* ================================= */}

        {loginMethod === "email" && (

          <div>

            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              className="w-full border p-3 rounded mb-4"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />


            <input
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              className="w-full border p-3 rounded mb-4"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
            />


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white hover:scale-105 transition py-3 rounded disabled:opacity-50"
            >

              {loading
                ? "Logging in..."
                : "Login"}

            </button>

          </div>

        )}


        {/* ================================= */}
        {/* PHONE LOGIN */}
        {/* ================================= */}

        {loginMethod === "phone" && (

          <div>

            <input
              type="tel"
              placeholder="01712345678"
              required
              disabled={otpSent}
              value={phone}
              className="w-full border p-3 rounded mb-4 disabled:bg-gray-100"
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />


            {/* RECAPTCHA */}

            {!otpSent && (

              <div
                id="recaptcha-container"
                className="mb-4"
              ></div>

            )}


            {/* SEND OTP */}

            {!otpSent && (

              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >

                {loading
                  ? "Sending OTP..."
                  : "Send OTP"}

              </button>

            )}


            {/* OTP */}

            {otpSent && (

              <div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">

                  <p className="text-sm text-green-700">

                    OTP has been sent to:

                  </p>

                  <p className="font-semibold text-green-800">

                    {phone}

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
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >

                  {loading
                    ? "Verifying..."
                    : "Verify OTP & Login"}

                </button>

              </div>

            )}

          </div>

        )}


        {/* ================================= */}
        {/* REGISTER */}
        {/* ================================= */}

        <Link to="/register">

          <button
            type="button"
            className="w-full mt-3 border border-slate-700 text-slate-900 hover:text-white hover:bg-slate-900 py-3 rounded"
          >

            Go To Register

          </button>

        </Link>


        <Toaster />

      </form>

    </div>

  );

}

// import { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../Firebase/firebase.js";
// import { Link, useNavigate } from "react-router-dom";
// // import toast from "react-hot-toast";
// import toast, { Toaster } from 'react-hot-toast';

// export default function Login() {
//   const navigate = useNavigate();
  
// // const notify = () => toast('Login Successfully');

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       await signInWithEmailAndPassword(
//         auth,
//         formData.email,
//         formData.password
//       );

//       // alert("Login Successful");
//       toast.success("Login Successful")

//       navigate("/dashboard");
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center rounded-2xl">
      
//       <form
//         onSubmit={handleLogin}
//         className="bg-white p-8 rounded-xl shadow-md w-96"
//       >
//         <h1 className="text-3xl font-bold text-center mb-6">
//          Smart_ Care Login
//         </h1>

//         <input
//           type="email"
//           placeholder="Email"
//           required
//           className="w-full border p-3 rounded mb-4"
//           onChange={(e) =>
//             setFormData({
//               ...formData,
//               email: e.target.value,
//             })
//           }
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           required
//           className="w-full border p-3 rounded mb-4"
//           onChange={(e) =>
//             setFormData({
//               ...formData,
//               password: e.target.value,
//             })
//           }
//         />

//         <button
//           type="submit"
//           className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white hover:scale-105 transition py-3 rounded"
//         >
//           Login
//         </button>
//         <Toaster/>

//         <Link to="/register">
//           <button
//             type="button"
//             className="w-full mt-3 border border-slate-700 text-slate-900 hover:text-white hover:bg-slate-900 py-3 rounded"
//           >
//             Go To Register
//           </button>
//         </Link>
//       </form>
//     </div>
//   );
// }