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
  const showNavbar = isLoggedIn && privatePaths.includes(location.pathname);

  const { data: profile, error, isLoading } = useGetAuthProfileQuery();

  useEffect(() => {
    if (profile) {
      dispatch(setAuth(profile));
    }
    if (error) {
      console.error("Failed to fetch profile:", error);
    }
  }, [profile, error]);


  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {publicRoutes.map(({ path, element }, index) => (
          <Route
            key={`public-${index}`}
            path={path}
            element={isLoggedIn ? <Navigate to="/" replace /> : element}
          />
        ))}

        {privateRoutes.map(({ path, element }, index) => (
          <Route
            key={`private-${index}`}
            path={path}
            element={isLoggedIn && user ? element : <Navigate to="/login" replace />}
          />
        ))}

        {adminRoutes.map(({ path, element }, index) => (
          <Route
            key={`admin-${index}`}
            path={path}
            element={isLoggedIn && user?.role === "admin" ? element : <Navigate to="/login" replace />}
          />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
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
