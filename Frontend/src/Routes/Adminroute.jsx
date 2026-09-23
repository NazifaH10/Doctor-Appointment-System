import { useContext } from "react";

import { Navigate } from "react-router-dom";

import {
    AuthContext,
} from "../Context/AuthContext.jsx";

import Loader from "../Components/Share/Loader.jsx";

export default function AdminRoute({
    children,
}) {
    const {
        role,
        loading,
    } = useContext(AuthContext);

    if (loading) {
        return <Loader />;
    }

    if (role === "admin") {
        return children;
    }

    return <Navigate to="/dashboard" />;
}