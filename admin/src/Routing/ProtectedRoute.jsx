import { jwtDecode } from "jwt-decode";
import { getCookie } from "@utils/helper";
import { Navigate } from "react-router-dom";


function ProtectedRoute({ children, allowedRoles }) {
    const token = getCookie("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = jwtDecode(token);
        const role = user.user_role;

        if (!allowedRoles.includes(role)) {
            return <Navigate to="/" replace />;
        }

        return children;
    } catch (err) {
        return <Navigate to="/login" replace />;
    }
}

export default ProtectedRoute;