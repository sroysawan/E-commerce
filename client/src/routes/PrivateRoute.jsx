import React from 'react'
import { Navigate } from "react-router-dom";
const PrivateRoute = ({ ok, children }) => {
    return ok === null ? null : ok ? children : <Navigate to="/" />;
}

export default PrivateRoute
