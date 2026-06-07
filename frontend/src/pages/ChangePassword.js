import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ChangePassword() {

    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const changePassword = async () => {

        try {

            const token = localStorage.getItem("token");

            await api.put(
                "/auth/change-password",
                {
                    oldPassword,
                    newPassword
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            alert("Password changed successfully");

            navigate("/");

        } catch (error) {

            alert(
                error.response?.data?.message || "Failed"
            );

        }

    };

    return (

        <div style={{ padding: "20px" }}>

            <h1>Change Password</h1>

            <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) =>
                    setOldPassword(e.target.value)
                }
            />

            <br /><br />

            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                    setNewPassword(e.target.value)
                }
            />

            <br /><br />

            <button onClick={changePassword}>
                Change Password
            </button>

        </div>

    );

}

export default ChangePassword;
