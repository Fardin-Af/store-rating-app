import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Signup() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {

        try {

            await api.post("/auth/signup", {
                name,
                email,
                address,
                password,
                role: "USER"
            });

            alert("Signup successful");

            navigate("/");

        } catch (error) {

            console.log(error);
            
            alert(
                JSON.stringify(error.response?.data || error.message)
            );

        }

    };

    return (

        <div style={{ textAlign: "center", marginTop: "50px" }}>

            <h1>Signup</h1>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <br /><br />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={handleSignup}>
                Signup
            </button>

            <br /><br />

            <button onClick={() => navigate("/")}>
                Back to Login
            </button>

        </div>

    );
}

export default Signup;