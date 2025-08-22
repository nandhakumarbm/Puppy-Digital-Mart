import { Navigate, useLocation } from "react-router-dom";
import { getIsLoggedIn } from "../utils/auth";

function RouteGuard({ children, guestOnly = false }) {
    const isLoggedIn = getIsLoggedIn();
    const location = useLocation();

    // If guest-only (login/signup) but user is logged in -> redirect
    if (guestOnly && isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    // If private route but user is NOT logged in -> redirect
    if (!guestOnly && !isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}

export default RouteGuard;