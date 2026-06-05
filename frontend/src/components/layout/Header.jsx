
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="dashboard-header">
            <div className="header-content">
                <h1>Store Rating System</h1>

                {user && (
                    <div className="user-info">
                        <span>
                            Welcome, {user.name} ({user.role})
                        </span>

                        <button
                            className="btn-secondary"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;