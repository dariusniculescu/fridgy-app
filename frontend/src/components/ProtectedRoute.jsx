import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const ProtectedRoute = ({ children, requiredRoles }) => {
  const user = useUser();

  const token = localStorage.getItem("token");
  if (!user && token) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />; 
  }

  return children;
};

export default ProtectedRoute;
