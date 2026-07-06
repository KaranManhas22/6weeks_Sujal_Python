import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedUserTypes = [] }) {
  const token = sessionStorage.getItem("token");

  const storedUser = sessionStorage.getItem("userData");
  const userData = storedUser ? JSON.parse(storedUser) : null;

  const userRole = userData?.role;

  if (!token || !userData) {
    return <Navigate to="/" replace />;
  }

  if (
    allowedUserTypes.length > 0 &&
    !allowedUserTypes.includes(userRole)
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
