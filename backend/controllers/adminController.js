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

    const sortBy = req.query.sortBy || "name";

    const allowedColumns = [
        "id",
        "name",
        "email",
        "address",
        "role"
    ];

    const column = allowedColumns.includes(sortBy)
        ? sortBy
        : "name";

    const sql = `
        SELECT
            id,
            name,
            email,
            address,
            role
        FROM users
        ORDER BY ${column}
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
            u.id,
            u.name,
            u.email,
            u.address,
            u.role,
            ROUND(AVG(r.rating),1) AS rating
        FROM users u
        LEFT JOIN stores s
        ON u.id = s.owner_id
        LEFT JOIN ratings r
        ON s.id = r.store_id
        WHERE u.id = ?
        GROUP BY
            u.id,
            u.name,
            u.email,
            u.address,
            u.role
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

    const { search } = req.query;

    const sql = `
        SELECT
            id,
            name,
            email,
            address,
            role
        FROM users
        WHERE
            name LIKE ?
            OR email LIKE ?
            OR address LIKE ?
            OR role LIKE ?
    `;

    const value = `%${search}%`;

    db.query(
        sql,
        [value, value, value, value],
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