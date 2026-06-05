import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError('');

        try {

            await login(
                email,
                password
            );

            navigate('/dashboard');

        } catch (error) {

            setError(
                error.response?.data?.message ||
                'Invalid email or password'
            );
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-form">

                <h2>Login</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                        />

                    </div>

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Login
                    </button>

                </form>

                <p className="auth-switch">
                    Don't have an account?{' '}
                    <Link to="/signup">
                        Sign Up
                    </Link>
                </p>

            </div>

        </div>
    );
};

export default LoginPage;