import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

const ProtectedRoute = ({
    children,
    allowedRoles
}) => {

    const { user, token } = useAuth();

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user?.role)
    ) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

const DashboardRedirect = () => {

    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    switch (user.role) {

        case 'ADMIN':
            return <Navigate to="/admin" />;

        case 'USER':
            return <Navigate to="/user" />;

        case 'OWNER':
            return <Navigate to="/owner" />;

        default:
            return <Navigate to="/login" />;
    }
};

function App() {

    const { user } = useAuth();

    return (
        <Routes>

            <Route
                path="/login"
                element={
                    !user
                        ? <LoginPage />
                        : <Navigate to="/dashboard" />
                }
            />

            <Route
                path="/signup"
                element={
                    !user
                        ? <SignupPage />
                        : <Navigate to="/dashboard" />
                }
            />

            <Route
                path="/dashboard"
                element={<DashboardRedirect />}
            />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user"
                element={
                    <ProtectedRoute allowedRoles={['USER']}>
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/owner"
                element={
                    <ProtectedRoute allowedRoles={['OWNER']}>
                        <StoreOwnerDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={
                    <Navigate
                        to={
                            user
                                ? '/dashboard'
                                : '/login'
                        }
                    />
                }
            />

        </Routes>
    );
}

export default App;