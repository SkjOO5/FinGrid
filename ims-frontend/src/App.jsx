import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setInitialized, setUser, logout } from './features/auth/authSlice';
import api from './api/axios';
import { mockGetMe, isMockToken } from './api/mockAuth';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/dashboard/Dashboard';

const Spinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-sm text-textSecondary">Loading...</p>
        </div>
    </div>
);

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);
    if (!isInitialized) return <Spinner />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);
    if (!isInitialized) return <Spinner />;
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    return children;
};

function App() {
  const dispatch = useDispatch();
  const { token, isInitialized } = useSelector(state => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        // Check if mock token
        if (isMockToken(token)) {
          const user = mockGetMe(token);
          if (user) {
            dispatch(setUser(user));
          } else {
            dispatch(logout()); // Token expired
          }
        } else {
          // Real JWT — validate with backend
          try {
            const res = await api.get('/auth/me');
            if (res.data.success) {
              dispatch(setUser(res.data.data));
            } else {
              dispatch(logout());
            }
          } catch {
            dispatch(logout());
          }
        }
      }
      dispatch(setInitialized());
    };
    initAuth();
  }, []); // Only run once on mount

  if (!isInitialized) return <Spinner />;

  return (
    <div className="min-h-screen bg-background text-textPrimary transition-colors duration-200">
        <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard/*" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
        </Routes>
    </div>
  );
}

export default App;
