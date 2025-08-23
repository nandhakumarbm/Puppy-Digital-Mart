import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { publicRoutes, privateRoutes, adminRoutes } from "./routes/routes";
import Navbar from "./components/Navbar";
import { getIsLoggedIn, getUser } from "./utils/auth";
import "./App.css";
import { useGetAuthProfileQuery } from "./utils/apiSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setAuth } from "./Slices/authSlice";

function App() {
  const isLoggedIn = getIsLoggedIn();
  const user = getUser();
  const location = useLocation();
  const dispatch = useDispatch();

  const privatePaths = privateRoutes.map(r => r.path);
  const adminPaths = adminRoutes.map(r => r.path);

  // Show navbar for both private (user) and admin routes when logged in
  const showNavbar = isLoggedIn && (
    privatePaths.includes(location.pathname) ||
    adminPaths.includes(location.pathname)
  );

  const { data: profile, error } = useGetAuthProfileQuery();

  useEffect(() => {
    if (profile) dispatch(setAuth(profile));
    if (error) console.error("Failed to fetch profile:", error);
  }, [profile, error, dispatch]);

  if (!user) return <h3>Loading...</h3>

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element }, index) => (
          <Route
            key={`public-${index}`}
            path={path}
            element={isLoggedIn ? <Navigate to="/" replace /> : element}
          />
        ))}

        {/* User Routes */}
        {isLoggedIn && user?.role === "user" && privateRoutes.map(({ path, element }, index) => (
          <Route key={`private-${index}`} path={path} element={element} />
        ))}

        {/* Admin Routes */}
        {isLoggedIn && user?.role === "admin" && adminRoutes.map(({ path, element }, index) => (
          <Route key={`admin-${index}`} path={path} element={element} />
        ))}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}