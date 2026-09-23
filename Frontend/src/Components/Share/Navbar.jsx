import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../Context/AuthContext.jsx";

import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/firebase.js";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import {
  FaUserCircle,
  FaBell,
} from "react-icons/fa";

export default function Navbar() {

  const { user, role } =
    useContext(AuthContext);

  const navigate = useNavigate();

  // ==========================================
  // NOTIFICATION STATES
  // ==========================================

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const notificationRef = useRef(null);


  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async () => {

    if (!user?.email) {
      return;
    }

    try {

      const res = await axios.get(
        `http://localhost:5000/api/notifications/user/${encodeURIComponent(
          user.email
        )}`
      );

      setNotifications(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.log(
        "Notification Fetch Error:",
        error
      );

    }
  };


  // ==========================================
  // FETCH UNREAD COUNT
  // ==========================================

  const fetchUnreadCount = async () => {

    if (!user?.email) {
      return;
    }

    try {

      const res = await axios.get(
        `http://localhost:5000/api/notifications/user/${encodeURIComponent(
          user.email
        )}/unread-count`
      );

      setUnreadCount(
        res.data?.count || 0
      );

    } catch (error) {

      console.log(
        "Unread Count Error:",
        error
      );

    }
  };


  // ==========================================
  // FETCH NOTIFICATIONS WHEN USER LOADS
  // ==========================================

  useEffect(() => {

    if (!user?.email) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();
    fetchUnreadCount();

  }, [user?.email]);


  // ==========================================
  // AUTO REFRESH
  // ==========================================

  useEffect(() => {

    if (!user?.email) {
      return;
    }

    const interval =
      setInterval(() => {

        fetchNotifications();
        fetchUnreadCount();

      }, 5000);

    return () =>
      clearInterval(interval);

  }, [user?.email]);


  // ==========================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // ==========================================

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {

        setShowNotifications(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  // ==========================================
  // MARK ONE NOTIFICATION AS READ
  // ==========================================

  const handleNotificationClick =
    async (notification) => {

      try {

        if (!notification.isRead) {

          await axios.put(
            `http://localhost:5000/api/notifications/${notification._id}/read`
          );

        }

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id
              ? {
                ...item,
                isRead: true,
              }
              : item
          )
        );

        setUnreadCount((prev) =>
          notification.isRead
            ? prev
            : Math.max(prev - 1, 0)
        );

      } catch (error) {

        console.log(
          "Mark Read Error:",
          error
        );

      }

    };


  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const handleMarkAllRead = async () => {

    if (!user?.email) {
      return;
    }

    try {

      await axios.put(
        `http://localhost:5000/api/notifications/user/${encodeURIComponent(
          user.email
        )}/read-all`
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      setUnreadCount(0);

      toast.success(
        "All notifications marked as read"
      );

    } catch (error) {

      console.log(
        "Mark All Read Error:",
        error
      );

      toast.error(
        "Failed to mark notifications as read"
      );

    }

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {

    try {

      await signOut(auth);

      toast.success(
        "Logout Successful"
      );

      navigate("/");

    } catch (error) {

      console.log(error);

    }

  };


  // ==========================================
  // FORMAT NOTIFICATION TIME
  // ==========================================

  const formatNotificationTime = (
    createdAt
  ) => {

    if (!createdAt) {
      return "";
    }

    const date =
      new Date(createdAt);

    const now =
      new Date();

    const difference =
      Math.floor(
        (now - date) / 1000
      );


    if (difference < 60) {
      return "Just now";
    }


    if (difference < 3600) {

      return `${Math.floor(
        difference / 60
      )} min ago`;

    }


    if (difference < 86400) {

      return `${Math.floor(
        difference / 3600
      )} hr ago`;

    }


    if (difference < 604800) {

      return `${Math.floor(
        difference / 86400
      )} day ago`;

    }


    return date.toLocaleDateString();

  };


  return (

    <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg px-8 py-4 rounded-2xl flex justify-between items-center">

      {/* ========================================
          LEFT
      ======================================== */}

      <div>

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-sm opacity-80">
          Welcome Back 👋
        </p>

      </div>


      {/* ========================================
          RIGHT
      ======================================== */}

      <div className="flex items-center gap-4">


        {/* ======================================
            NOTIFICATION BELL
        ====================================== */}

        <div
          className="relative"
          ref={notificationRef}
        >

          <button
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            className="relative w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
          >

            <FaBell
              className="text-2xl"
            />


            {/* UNREAD BADGE */}

            {unreadCount > 0 && (

              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center border-2 border-slate-800">

                {unreadCount > 99
                  ? "99+"
                  : unreadCount}

              </span>

            )}

          </button>


          {/* ==================================
              NOTIFICATION DROPDOWN
          ================================== */}

          {showNotifications && (

            <div className="absolute right-0 top-14 w-96 bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200">


              {/* HEADER */}

              <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">

                <div>

                  <h3 className="font-bold text-lg">
                    Notifications
                  </h3>

                  {unreadCount > 0 && (

                    <p className="text-xs text-gray-500">

                      {unreadCount} unread

                    </p>

                  )}

                </div>


                {notifications.length > 0 && (

                  <button
                    onClick={
                      handleMarkAllRead
                    }
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Mark all as read
                  </button>

                )}

              </div>


              {/* NOTIFICATIONS */}

              <div className="max-h-[400px] overflow-y-auto">

                {notifications.length === 0 ? (

                  <div className="py-12 text-center">

                    <FaBell className="mx-auto text-4xl text-gray-300 mb-3" />

                    <p className="text-gray-500 font-medium">
                      No notifications
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      You're all caught up!
                    </p>

                  </div>

                ) : (

                  notifications.map(
                    (notification) => (

                      <div
                        key={
                          notification._id
                        }
                        onClick={() =>
                          handleNotificationClick(
                            notification
                          )
                        }
                        className={`px-4 py-4 border-b cursor-pointer transition-colors ${notification.isRead
                            ? "bg-white hover:bg-gray-50"
                            : "bg-blue-50 hover:bg-blue-100"
                          }`}
                      >

                        <div className="flex gap-3">


                          {/* UNREAD DOT */}

                          <div className="pt-1">

                            {!notification.isRead ? (

                              <div className="w-3 h-3 bg-blue-500 rounded-full" />

                            ) : (

                              <div className="w-3 h-3 border-2 border-gray-300 rounded-full" />

                            )}

                          </div>


                          {/* CONTENT */}

                          <div className="flex-1">

                            <h4 className="font-semibold text-sm">

                              {notification.title}

                            </h4>

                            <p className="text-sm text-gray-600 mt-1">

                              {notification.message}

                            </p>

                            <p className="text-xs text-gray-400 mt-2">

                              {formatNotificationTime(
                                notification.createdAt
                              )}

                            </p>

                          </div>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          )}

        </div>


        {/* ======================================
            PROFILE
        ====================================== */}

        <div className="flex justify-center items-center gap-2">

          <FaUserCircle
            className="w-12 h-12 rounded-full border-2 border-white"
          />


          <div className="text-right">

            <h2 className="font-bold text-lg">

              {user?.email?.split("@")[0]}

            </h2>

            <p className="text-sm capitalize">

              {role}

            </p>

            <p className="text-xs opacity-80">

              {user?.email}

            </p>

          </div>

        </div>


        {/* ======================================
            LOGOUT
        ====================================== */}

        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300"
        >

          Logout

        </button>

      </div>

    </div>

  );

}

// // import { signOut } from "firebase/auth";
// // import { auth } from "../../Firebase/firebase.js";
// // import { useNavigate } from "react-router-dom";
// // import {
// //   FaSignOutAlt,
// // } from "react-icons/fa";

// // export default function Navbar() {

// //     const navigate = useNavigate();

// // const handleLogout = async () => {
// //   await signOut(auth);

// //   navigate("/");
// // };

// //   return (
// //     <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow px-8 py-4 flex justify-between items-center rounded-xl">
// //       <h1 className="text-2xl font-bold">
// //         Hospital Dashboard
// //       </h1>

// //       <div className="flex items-center gap-3">
// //         <img
// //           src="https://i.pravatar.cc/40"
// //           alt=""
// //           className="w-10 h-10 rounded-full"
// //         />

// //         <div>
// //           <p className="font-semibold">{auth.currentUser?.role}</p>
// //           <p className="text-sm text-gray-500">
// //             Hospital Manager
// //           </p>
// //         </div>

// //         {/* <button onClick={handleLogout}>
// //             <FaSignOutAlt />
// //           Logout
// //           </button> */}
// //       </div>
// //     </div>
// //   );
// // }

// import { useContext } from "react";

// import {
//   AuthContext,
// } from "../../Context/AuthContext.jsx";

// import { signOut } from "firebase/auth";

// import { auth } from "../../Firebase/firebase.js";

// import { useNavigate } from "react-router-dom";

// import toast from "react-hot-toast";
// import { FaUserCircle } from "react-icons/fa";

// export default function Navbar() {
//   const { user, role } =
//     useContext(AuthContext);
// console.log(user)
//   const navigate = useNavigate();

//   // LOGOUT
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);

//       toast.success("Logout Successful");

//       navigate("/");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg px-8 py-4 rounded-2xl flex justify-between items-center">
//       {/* LEFT */}
//       <div>
//         <h1 className="text-3xl font-bold">
//           Dashboard
//         </h1>

//         <p className="text-sm opacity-80">
//           Welcome Back 👋
//         </p>
//       </div>

//       {/* RIGHT */}
//       <div className="flex items-center gap-3">
//         {/* PROFILE IMAGE */}
//         {/* <img
//           src="https://i.pravatar.cc/150?img=12"
//           alt=""
//           className="w-12 h-12 rounded-full border-2 border-white"
//         /> */}
//         <div className="flex justify-center items-center">
//           <FaUserCircle className="w-12 h-12 rounded-full border-2 border-white" />

//           {/* USER INFO */}
//           <div className="text-right">
//             <h2 className="font-bold text-lg">
//               {user?.email?.split("@")[0]}
//             </h2>

//             <p className="text-sm capitalize">
//               {role}
//             </p>

//             <p className="text-xs opacity-80">
//               {user?.email}
//             </p>
//           </div>
//         </div>

//         {/* LOGOUT BUTTON */}
//         <button
//           onClick={handleLogout}
//           className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }