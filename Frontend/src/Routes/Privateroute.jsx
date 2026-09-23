// import { Navigate } from "react-router-dom";
// import { auth } from "../Firebase/firebase.js";

// export default function PrivateRoute({ children }) {
//   return auth.currentUser ? children : <Navigate to="/" />;
// }

import { useContext } from "react";

import { Navigate } from "react-router-dom";

import {
  AuthContext,
} from "../Context/AuthContext.jsx";

import Loader from "../Components/Share/Loader.jsx"

export default function PrivateRoute({
  children,
}) {
  const { user, loading } =
    useContext(AuthContext);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader/>
      </div>
    );
  }

  // USER EXISTS
  if (user) {
    return children;
  }

  // NO USER
  return <Navigate to="/" />;
}