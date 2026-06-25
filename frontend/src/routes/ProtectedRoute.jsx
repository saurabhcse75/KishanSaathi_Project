import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { auth } = useContext(AuthContext);

  if (! auth  || !auth.token) return <Navigate to="/" replace/>;

  if (role && auth.user.role !== role) {
    return <Navigate to="/" replace/>;
  }

  return children;
};

export default ProtectedRoute;