import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        try {

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            if (response.data.user.role === "ADMIN") {
                navigate("/admin");
            }
            else if (response.data.user.role === "OWNER") {
                navigate("/owner");
            }
            else {
                navigate("/user");
            }

        }
        catch (error) {

            alert(
                error.response?.data?.message || "Login Failed"
            );

        }

    };

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>

            <h1>Store Rating App</h1>

            <h2>Login</h2>

            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={handleLogin}>
                Login
            </button>

            <br /><br />

            <button onClick={() => navigate("/signup")}>
                Signup
            </button>

        </div>
    );
}

export default Login;