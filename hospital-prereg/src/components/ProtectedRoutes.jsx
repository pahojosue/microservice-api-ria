import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({roleProps}) => {    
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("userRole");
    var isAuthenticated = token && role ? true : false;
    var isAuthorized = true;

    if(isAuthenticated) {
        if(roleProps) {
            if(roleProps !== role) {
                isAuthorized = false;
            }
        }
    }

    return isAuthenticated
            ? (
                isAuthorized
                ? <Outlet />
                : <Navigate to="/unauthorized" replace />
            ) : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;