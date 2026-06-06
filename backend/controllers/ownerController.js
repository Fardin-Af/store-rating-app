const db = require("../config/db");

const getOwnerDashboard = (req, res) => {

    const ownerId = req.user.id;

    const sql = `
        SELECT
            s.id,
            s.name AS storeName,
            ROUND(AVG(r.rating),1) AS averageRating,
            u.name AS userName,
            r.rating
        FROM stores s
        LEFT JOIN ratings r
            ON s.id = r.store_id
        LEFT JOIN users u
            ON r.user_id = u.id
        WHERE s.owner_id = ?
        GROUP BY
            s.id,s
            s.name,
            u.name,
            r.rating
    `;

    db.query(sql, [ownerId], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(200).json(result);

    });

};

module.exports = {
    getOwnerDashboard
};