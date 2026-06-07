import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function OwnerDashboard() {

    const [ratings, setRatings] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchRatings();
    }, []);

    const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
};

    const fetchRatings = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
                "/owner/dashboard",
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            setRatings(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div style={{ padding: "20px" }}>

            <h1>Owner Dashboard</h1>

<button onClick={() => navigate("/change-password")}>
    Change Password
</button>

&nbsp;&nbsp;

<button onClick={logout}>
    Logout
</button>

<br /><br />

            <table border="1" cellPadding="10">

                <thead>

                    <tr>
                        <th>User Name</th>
                        <th>User Email</th>
                        <th>Rating</th>
                    </tr>

                </thead>

                <tbody>

                    {ratings.map((item, index) => (

                        <tr key={index}>

                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.rating}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default OwnerDashboard;