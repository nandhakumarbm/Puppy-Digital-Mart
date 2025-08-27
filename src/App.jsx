import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { publicRoutes, privateRoutes, adminRoutes } from "./routes/routes";
import Navbar from "./components/Navbar";
import { getIsLoggedIn, getUser, clearAuth } from "./utils/auth";
import "./App.css";
import { useGetAuthProfileQuery } from "./utils/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setAuth, clearAuth as clearReduxAuth } from "./Slices/authSlice";

import { setAuth as setAdminAuth } from "./Admin/slices/profile";

// Loading component for better UX
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px'
  }}>
    Loading...
  </div>
);

// Protected Route wrapper component
const ProtectedRoute = ({ children, requiredRole, currentUserRole, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUserRole !== requiredRole) {
    // Redirect based on user role - admin goes to /users,  user goes to /
    const redirectPath = currentUserRole === "admin" ? "/admin/" : "/user/";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get auth state from both localStorage and Redux
  const isLoggedIn = getIsLoggedIn();
  const localUser = getUser();
  const reduxUser = useSelector(state => state.auth.user);

  // Use Redux user if available, fallback to localStorage
  const user = reduxUser || localUser;

  const privatePaths = privateRoutes.map(r => r.path);
  const adminPaths = adminRoutes.map(r => r.path);

  // Show navbar for authenticated users on protected routes
  const showNavbar = isLoggedIn && user && (
    privatePaths.includes(location.pathname) ||
    adminPaths.includes(location.pathname)
  );

  // Fetch user profile to validate token and get fresh data
  const {
    data: profile,
    error,
    isLoading: profileLoading,
    isError
  } = useGetAuthProfileQuery(undefined, {
    skip: !isLoggedIn // Skip query if not logged in
  });

  // Handle profile data and errors
  useEffect(() => {
    if (profile) {
      if (user?.role === "admin") {
        dispatch(setAdminAuth(profile));
        setIsInitialized(true);
      } else {
        dispatch(setAuth(profile));
        setIsInitialized(true);
      }
    } else if (isError || error) {
      console.error("Failed to fetch profile:", error);
      // If token is invalid, clear auth data
      if (error?.status === 401 || error?.status === 403) {
        dispatch(clearReduxAuth());
        clearAuth({ silent: true, redirect: false });
      }
      setIsInitialized(true);
    } else if (!isLoggedIn) {
      setIsInitialized(true);
    }
  }, [profile, error, isError, dispatch, isLoggedIn]);

  // Show loading while validating authentication
  if (isLoggedIn && profileLoading && !isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public Routes - only accessible when not logged in */}
        {publicRoutes.map(({ path, element }, index) => (
          <Route
            key={`public-${index}`}
            path={path}
            element={
              isLoggedIn && user ? (
                <Navigate
                  to={user.role === "admin" ? "/admin/" : "/user/"}
                  replace
                />
              ) : (
                element
              )
            }
          />
        ))}

        {/* User/Private Routes - only for authenticated users with 'user' role */}
        {privateRoutes.map(({ path, element }, index) => (
          <Route
            key={`private-${index}`}
            path={path}
            element={
              <ProtectedRoute
                requiredRole="user"
                currentUserRole={user?.role}
                isAuthenticated={isLoggedIn && user}
              >
                {element}
              </ProtectedRoute>
            }
          />
        ))}

        {/* Admin Routes - only for authenticated users with 'admin' role */}
        {adminRoutes.map(({ path, element }, index) => (
          <Route
            key={`admin-${index}`}
            path={path}
            element={
              <ProtectedRoute
                requiredRole="admin"
                currentUserRole={user?.role}
                isAuthenticated={isLoggedIn && user}
              >
                {element}
              </ProtectedRoute>
            }
          />
        ))}

        {/* Catch-all route - redirect based on authentication and role */}
        <Route
          path="*"
          element={
            !isLoggedIn || !user ? (
              <Navigate to="/login" replace />
            ) : user.role === "admin" ? (
              <Navigate to="/admin/" replace />
            ) : (
              <Navigate to="/user/" replace />
            )
          }
        />
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