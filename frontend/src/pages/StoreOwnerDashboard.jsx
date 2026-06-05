/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';

const StoreOwnerDashboard = () => {

    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { api } = useAuth();

    useEffect(() => {

        const loadStoreData = async () => {

            try {

                const response = await api.get(
                    '/stores/my-store'
                );

                setStoreData(response.data);

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    'Unable to load dashboard'
                );

            } finally {

                setLoading(false);
            }
        };

        loadStoreData();

    }, [api]);

    if (loading) {

        return (
            <div className="dashboard-container">
                <Header />

                <main className="dashboard-content">
                    <p>Loading dashboard...</p>
                </main>
            </div>
        );
    }

    if (error) {

        return (
            <div className="dashboard-container">
                <Header />

                <main className="dashboard-content">
                    <p className="error-message">
                        {error}
                    </p>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-container">

            <Header />

            <main className="dashboard-content">

                <h2>Store Dashboard</h2>

                <div className="stats-card">

                    <h3>Average Rating</h3>

                    <p className="stat-number">
                        {storeData?.averageRating}
                    </p>

                </div>

                <h3>Ratings Received</h3>

                <div className="table-container">

                    <table>

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Rating</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>

                            {storeData?.raters?.length > 0 ? (

                                storeData.raters.map(
                                    (person, index) => (
                                        <tr key={index}>
                                            <td>{person.name}</td>
                                            <td>{person.email}</td>
                                            <td>{person.rating}</td>
                                            <td>
                                                {new Date(
                                                    person.updated_at
                                                ).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    )
                                )

                            ) : (

                                <tr>
                                    <td colSpan="4">
                                        No ratings available
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </main>

        </div>
    );
};

export default StoreOwnerDashboard;