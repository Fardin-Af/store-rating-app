import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {

    const navigate = useNavigate();

    const [stores, setStores] = useState([]);
    const [users, setUsers] = useState([]);
    const [sortBy, setSortBy] = useState("name");
    const [search, setSearch] = useState("");

    useEffect(() => {
    fetchStores();
}, []);

    useEffect(() => {
    fetchUsers();
}, [sortBy]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

const addStore = async () => {

    try {

        const token = localStorage.getItem("token");

        await api.post(
            "/stores/add",
            {
                name: document.getElementById("storeName").value,
                email: document.getElementById("storeEmail").value,
                address: document.getElementById("storeAddress").value,
                owner_id: Number(
                    document.getElementById("ownerId").value
                )
            },
            {
                headers: {
                    Authorization: token
                }
            }
        );

        alert("Store added successfully");

        await fetchStores();
        await fetchUsers();

        document.getElementById("storeName").value = "";
document.getElementById("storeEmail").value = "";
document.getElementById("storeAddress").value = "";
document.getElementById("ownerId").value = "";

    } catch (error) {

        alert(
            error.response?.data?.message || "Failed"
        );

    }

};

const addUser = async () => {

    try {

        await api.post(
            "/auth/signup",
            {
                name: document.getElementById("userName").value,
                email: document.getElementById("userEmail").value,
                address: document.getElementById("userAddress").value,
                password: document.getElementById("userPassword").value,
                role: document.getElementById("userRole").value
            }
        );

        alert("User added successfully");

        document.getElementById("userName").value = "";
document.getElementById("userEmail").value = "";
document.getElementById("userAddress").value = "";
document.getElementById("userPassword").value = "";
document.getElementById("userRole").value = "USER";

await fetchUsers();
await fetchStores();

    } catch (error) {

        alert(
            error.response?.data?.message || "Failed"
        );

    }

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

    const fetchUsers = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(
    `/admin/users?sortBy=${sortBy}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            setUsers(response.data);

        } catch (error) {
            console.log(error);
        }

    };

    const searchUser = async () => {

    try {

        const token = localStorage.getItem("token");

        const response = await api.get(
            `/admin/users/search?search=${search}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        setUsers(response.data);

    } catch (error) {

        console.log(error);

    }

};

    return (

        <div style={{ padding: "20px" }}>

            <h1>Admin Dashboard</h1>

            <button onClick={() => navigate("/change-password")}>
    Change Password
</button>

&nbsp;&nbsp;

<button onClick={logout}>
    Logout
</button>

<br /><br />

<h2>Add Store</h2>

<input
    type="text"
    placeholder="Store Name"
    id="storeName"
/>

<br /><br />

<input
    type="email"
    placeholder="Store Email"
    id="storeEmail"
/>

<br /><br />

<input
    type="text"
    placeholder="Store Address"
    id="storeAddress"
/>

<br /><br />

<input
    type="number"
    placeholder="Owner ID"
    id="ownerId"
/>

<br /><br />

<button onClick={addStore}>
    Add Store
</button>

<hr />

<h2>Add User</h2>

<input
    type="text"
    placeholder="Name"
    id="userName"
/>

<br /><br />

<input
    type="email"
    placeholder="Email"
    id="userEmail"
/>

<br /><br />

<input
    type="text"
    placeholder="Address"
    id="userAddress"
/>

<br /><br />

<input
    type="password"
    placeholder="Password"
    id="userPassword"
/>

<br /><br />

<label>
    Role
</label>
<br />

<select
    id="userRole"
    defaultValue="USER"
>

    <option value="USER">
        USER
    </option>

    <option value="ADMIN">
        ADMIN
    </option>

    <option value="OWNER">
        OWNER
    </option>

</select>

<br /><br />

<button onClick={addUser}>
    Add User
</button>

<hr />

            <br /><br />

            <h2>Total Users: {users.length}</h2>

            <h2>Total Stores: {stores.length}</h2>

            <h2>
                Total Ratings: {
                    stores.reduce(
                        (sum, store) =>
                            sum + (store.averageRating ? 1 : 0),
                        0
                    )
                }
            </h2>

            <hr />

            <h2>Stores</h2>

            <table border="1" cellPadding="10">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Average Rating</th>
                    </tr>
                </thead>

                <tbody>

                    {stores.map((store) => (

                        <tr key={store.id}>
                            <td>{store.name}</td>
                            <td>{store.email}</td>
                            <td>{store.address}</td>
                            <td>{store.averageRating}</td>
                        </tr>

                    ))}

                </tbody>

            </table>

            <br />

            <input
    type="text"
    placeholder="Search User"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
/>

<button onClick={searchUser}>
    Search
</button>

<br /><br />

            <select
    value={sortBy}
    onChange={(e) => {
        setSortBy(e.target.value);
    }}
>
    <option value="id">Sort by ID</option>
    <option value="name">Sort by Name</option>
    <option value="email">Sort by Email</option>
    <option value="address">Sort by Address</option>
    <option value="role">Sort by Role</option>
</select>

<br /><br />

            <h2>Users</h2>

            <table border="1" cellPadding="10">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {users.map((user) => (

                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.address}</td>
                            <td>{user.role}</td>

                            <td>
    <button
        onClick={async () => {

    try {

        const token = localStorage.getItem("token");

        const response = await api.get(
            `/admin/users/${user.id}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        const data = response.data;

        alert(
`Name: ${data.name}
Email: ${data.email}
Address: ${data.address}
Role: ${data.role}
Rating: ${data.rating ?? "N/A"}`
        );

    } catch (error) {

        alert("Failed to fetch user details");

    }

}}
    >
        View
    </button>
</td>
                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default AdminDashboard;