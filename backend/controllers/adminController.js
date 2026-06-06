const db = require("../config/db");

const getDashboard = (req, res) => {

    const dashboardData = {};

    db.query(
        "SELECT COUNT(*) AS totalUsers FROM users",
        (err, userResult) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            dashboardData.totalUsers =
                userResult[0].totalUsers;

            db.query(
                "SELECT COUNT(*) AS totalStores FROM stores",
                (err, storeResult) => {

                    if (err) {
                        return res.status(500).json({
                            message: err.message
                        });
                    }

                    dashboardData.totalStores =
                        storeResult[0].totalStores;

                    db.query(
                        "SELECT COUNT(*) AS totalRatings FROM ratings",
                        (err, ratingResult) => {

                            if (err) {
                                return res.status(500).json({
                                    message: err.message
                                });
                            }

                            dashboardData.totalRatings =
                                ratingResult[0].totalRatings;

                            res.status(200).json(
                                dashboardData
                            );

                        }
                    );

                }
            );

        }
    );

};

const getAllUsers = (req, res) => {

    const sql = `
        SELECT
            id,
            name,
            email,
            address,
            role
        FROM users
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json(result);

    });

};

const getUserById = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            id,
            name,
            email,
            address,
            role
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

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

        res.status(200).json(result[0]);

    });

};

const searchUsers = (req, res) => {

    const { name } = req.query;

    const sql = `
        SELECT
            id,
            name,
            email,
            address,
            role
        FROM users
        WHERE name LIKE ?
    `;

    db.query(
        sql,
        [`%${name}%`],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(200).json(result);

        }
    );

};

module.exports = {
    getDashboard,
    getAllUsers,
    getUserById,
    searchUsers
};