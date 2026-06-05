import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { api } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError('');
        setSuccess('');

        try {

            await api.post('/auth/register', {
                name,
                email,
                address,
                password
            });

            setSuccess(
                'Registration successful. Please login.'
            );

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                'Unable to create account'
            );
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-form">

                <h2>Create Account</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Full Name</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            required
                        />

                    </div>

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

                        <label>Address</label>

                        <textarea
                            value={address}
                            onChange={(event) =>
                                setAddress(event.target.value)
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

                    {success && (
                        <p className="success-message">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Sign Up
                    </button>

                </form>

                <p className="auth-switch">
                    Already have an account?{' '}
                    <Link to="/login">
                        Login
                    </Link>
                </p>

            </div>

        </div>
    );
};

export default SignupPage;