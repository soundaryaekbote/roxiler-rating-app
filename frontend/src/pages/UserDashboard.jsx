/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';

const UserDashboard = () => {

    const [stores, setStores] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchBy, setSearchBy] = useState('name');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { api } = useAuth();

    useEffect(() => {

        const loadStores = async () => {

            try {

                setLoading(true);

                const queryParams =
                    new URLSearchParams();

                if (searchText) {
                    queryParams.append(
                        searchBy,
                        searchText
                    );
                }

                const response = await api.get(
                    `/stores?${queryParams.toString()}`
                );

                setStores(response.data);

            } catch (error) {

                console.error(error);

                setError(
                    'Unable to load stores'
                );

            } finally {

                setLoading(false);
            }
        };

        loadStores();

    }, [api, searchText, searchBy]);

    const submitRating = async (
        storeId,
        rating
    ) => {

        try {

            await api.post(
                `/stores/${storeId}/ratings`,
                { rating }
            );

            const queryParams =
                new URLSearchParams();

            if (searchText) {
                queryParams.append(
                    searchBy,
                    searchText
                );
            }

            const response = await api.get(
                `/stores?${queryParams.toString()}`
            );

            setStores(response.data);

        } catch (error) {

            alert(
                'Unable to submit rating'
            );
        }
    };

    return (
        <div className="dashboard-container">

            <Header />

            <main className="dashboard-content">

                <h2>All Stores</h2>

                <div className="search-bar">

                    <input
                        type="text"
                        placeholder={`Search by ${searchBy}`}
                        value={searchText}
                        onChange={(event) =>
                            setSearchText(
                                event.target.value
                            )
                        }
                    />

                    <select
                        value={searchBy}
                        onChange={(event) =>
                            setSearchBy(
                                event.target.value
                            )
                        }
                    >
                        <option value="name">
                            Name
                        </option>

                        <option value="address">
                            Address
                        </option>

                    </select>

                </div>

                {loading && (
                    <p>Loading stores...</p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <div className="store-list">

                    {!loading &&
                        stores.map((store) => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                onRate={submitRating}
                            />
                        ))}

                </div>

            </main>

        </div>
    );
};

const StoreCard = ({
    store,
    onRate
}) => {

    const [rating, setRating] =
        useState(
            store.userSubmittedRating || 0
        );

    const handleSubmit = () => {

        if (
            rating >= 1 &&
            rating <= 5
        ) {

            onRate(
                store.id,
                rating
            );

        } else {

            alert(
                'Please select a rating between 1 and 5'
            );
        }
    };

    return (

        <div className="store-card">

            <h3>{store.name}</h3>

            <p className="store-address">
                {store.address}
            </p>

            <div className="store-rating-info">

                <span>
                    Overall Rating:{' '}
                    <strong>
                        {store.overallRating}
                    </strong>
                </span>

                <span>
                    Your Rating:{' '}
                    <strong>
                        {store.userSubmittedRating ||
                            'Not Rated'}
                    </strong>
                </span>

            </div>

            <div className="rating-input-area">

                <select
                    value={rating}
                    onChange={(event) =>
                        setRating(
                            Number(
                                event.target.value
                            )
                        )
                    }
                >

                    <option
                        value="0"
                        disabled
                    >
                        Rate
                    </option>

                    <option value="1">
                        1 - Poor
                    </option>

                    <option value="2">
                        2 - Fair
                    </option>

                    <option value="3">
                        3 - Good
                    </option>

                    <option value="4">
                        4 - Very Good
                    </option>

                    <option value="5">
                        5 - Excellent
                    </option>

                </select>

                <button
                    onClick={handleSubmit}
                    className="btn-primary"
                >
                    {store.userSubmittedRating
                        ? 'Update'
                        : 'Submit'}
                </button>

            </div>

        </div>
    );
};

export default UserDashboard;