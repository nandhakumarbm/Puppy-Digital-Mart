import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getIsLoggedIn } from "../utils/auth";

function RequireAuth() {
  const ok = getIsLoggedIn();
  const loc = useLocation();
  return ok ? <Outlet /> : <Navigate to="/" replace state={{ from: loc }} />;
}

export default RequireAuth;