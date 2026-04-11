import { getCookie, removeCookie } from "@utils/helper";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
    const token = getCookie("token");

    if (!token) return <Navigate to="/login" replace />;

    try {
        const user = jwtDecode(token);
        const role = user.user_role;

        if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
            console.warn("Role not allowed:", role);
            return <Navigate to="/" replace />;
        }

        return children;
    } catch (err) {
        console.error("Auth Error:", err);
        removeCookie("token");
        return <Navigate to="/login" replace />;
    }
}
export default ProtectedRoute;