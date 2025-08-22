import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { publicRoutes, privateRoutes, adminRoutes } from "./routes/routes";
import Navbar from "./components/Navbar";
import { getIsLoggedIn, getUser } from "./utils/auth";
import "./App.css";

function App() {
  const balance = "ORB 60";
  const isLoggedIn = getIsLoggedIn();
  const user = getUser();
  const location = useLocation();

  const privatePaths = privateRoutes.map(r => r.path);
  const showNavbar = isLoggedIn && privatePaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar balance={balance} />}
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
