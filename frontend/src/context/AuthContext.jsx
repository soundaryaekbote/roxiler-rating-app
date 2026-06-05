/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useState,
    useContext,
    useEffect
} from 'react';

import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    const [token, setToken] = useState(
        localStorage.getItem('token') || null
    );

    const api = axios.create({
        baseURL:
            import.meta.env.VITE_API_BASE_URL ||
            'http://localhost:5000/api',

        headers: {
            'Content-Type': 'application/json'
        }
    });

    api.interceptors.request.use(
        (config) => {

            const savedToken =
                localStorage.getItem('token');

            if (savedToken) {
                config.headers.Authorization =
                    `Bearer ${savedToken}`;
            }

            return config;
        },

        (error) => {
            return Promise.reject(error);
        }
    );

    useEffect(() => {

        if (token) {

            localStorage.setItem(
                'token',
                token
            );

        } else {

            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }

    }, [token]);

    const login = async (
        email,
        password
    ) => {

        try {

            const response = await api.post(
                '/auth/login',
                {
                    email,
                    password
                }
            );

            if (response.data) {

                setToken(
                    response.data.token
                );

                setUser(
                    response.data.user
                );

                localStorage.setItem(
                    'user',
                    JSON.stringify(
                        response.data.user
                    )
                );
            }

            return response;

        } catch (error) {

            console.error(
                'Login failed:',
                error
            );

            throw error;
        }
    };

    const logout = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        token,
        api,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};