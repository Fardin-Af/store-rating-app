const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= SIGNUP =================

const signup = async (req, res) => {

    const { name, email, address, password, role } = req.body;

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

// ================= LOGIN =================

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

// ================= CHANGE PASSWORD =================

const changePassword = (req, res) => {

    res.json({
        message: "Change Password API Working"
    });

};

// ================= EXPORTS =================

module.exports = {
    signup,
    login,
    changePassword
};