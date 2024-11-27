import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
