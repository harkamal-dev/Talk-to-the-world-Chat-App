import React from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
        return <Navigate to="/" />;
    }

	return children;
};

export default ProtectedRoute;
