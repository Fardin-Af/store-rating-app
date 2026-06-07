const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {

    const { name, email, address, password, role } = req.body;

    if (name.length < 20 || name.length > 60) {
    return res.status(400).json({
        message: "Name must be between 20 and 60 characters"
    });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
    return res.status(400).json({
        message: "Invalid email format"
    });
}

if (address.length > 400) {
    return res.status(400).json({
        message: "Address cannot exceed 400 characters"
    });
}

const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

if (!passwordRegex.test(password)) {
    return res.status(400).json({
        message:
            "Password must be 8-16 characters and contain one uppercase letter and one special character"
    });
}
    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users(name,email,address,password,role)
            VALUES(?,?,?,?,?)
        `;

        db.query(
            sql,
            [name, email, address, hashedPassword, role],
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        message: err.message
                    });
                }

                res.status(201).json({
                    message: "User created successfully"
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


const login = (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    });

};


const changePassword = async (req, res) => {

    const { oldPassword, newPassword } = req.body;
    const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
        message:
            "Password must be 8-16 characters and contain one uppercase letter and one special character"
    });
}

    const userId = req.user.id;

    const sql = "SELECT * FROM users WHERE id = ?";

    db.query(sql, [userId], async (err, result) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Old password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        db.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, userId],
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: err.message
                    });
                }

                res.status(200).json({
                    message: "Password updated successfully"
                });

            }
        );

    });

};


module.exports = {
    signup,
    login,
    changePassword
};