import { useContext } from "react";

import { Navigate } from "react-router-dom";

import {
  AuthContext,
} from "../Context/AuthContext.jsx";

import Loader from "../Components/Share/Loader";

export default function DoctorRoute({
  children,
}) {
  const {
    role,
    loading,
  } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  if (role === "doctor") {
    return children;
  }

  return <Navigate to="/dashboard" />;
}