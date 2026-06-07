import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function UserDashboard() {

    const navigate = useNavigate();

    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchStores();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const fetchStores = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/stores",
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            setStores(response.data);

        } catch (error) {
            console.log(error);
        }

    };

const searchStore = async () => {

    try {

        const token = localStorage.getItem("token");

        const response = await api.get(
            `/stores/search?search=${search}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        setStores(response.data);

    } catch (error) {

        console.log(error);

    }

};

    const submitRating = async (storeId, rating) => {

        const token = localStorage.getItem("token");

        try {

            await api.post(
                "/ratings",
                {
                    store_id: storeId,
                    rating: Number(rating)
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            alert("Rating submitted successfully");

        } catch (err) {

            if (
                err.response?.data?.message ===
                "You have already rated this store. Please update your rating."
            ) {

                try {

                    await api.put(
                        `/ratings/${storeId}`,
                        {
                            rating: Number(rating)
                        },
                        {
                            headers: {
                                Authorization: token
                            }
                        }
                    );

                    alert("Rating updated successfully");

                } catch (error) {

                    alert(
                        error.response?.data?.message || "Update failed"
                    );

                    return;
                }

            } else {

                alert(
                    err.response?.data?.message || "Failed"
                );

                return;

            }

        }

        fetchStores();

    };

    return (

        <div style={{ padding: "20px" }}>

            <h1>User Dashboard</h1>
            <button onClick={() => navigate("/change-password")}>
    Change Password
</button>

&nbsp;&nbsp;

<button onClick={logout}>
    Logout
</button>

<br /><br />

<input
    type="text"
    placeholder="Search Store"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
/>

<button onClick={searchStore}>
    Search
</button>

<br /><br />


            <table border="1" cellPadding="10">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Average Rating</th>
                        <th>Your Rating</th>
                        <th>Rate</th>
                    </tr>
                </thead>

                <tbody>

                    {stores.map((store) => (

                        <tr key={store.id}>

                            <td>{store.name}</td>
                            <td>{store.email}</td>
                            <td>{store.address}</td>
                            <td>{store.averageRating}</td>
                            <td>{store.userRating ?? "-"}</td>

                            <td>

                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    id={`rating-${store.id}`}
                                />

                                <button
                                    onClick={() =>
                                        submitRating(
                                            store.id,
                                            document.getElementById(
                                                `rating-${store.id}`
                                            ).value
                                        )
                                    }
                                >
                                    Submit
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default UserDashboard;