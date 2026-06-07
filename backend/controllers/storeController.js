const db = require("../config/db");

const addStore = (req, res) => {

    const {
        name,
        email,
        address,
        owner_id
    } = req.body;

    const sql = `
        INSERT INTO stores(
            name,
            email,
            address,
            owner_id
        )
        VALUES(?,?,?,?)
    `;

    db.query(
        sql,
        [name, email, address, owner_id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Store added successfully"
            });

        }
    );

};
const getAllStores = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            s.id,
            s.name,
            s.email,
            s.address,
            ROUND(AVG(r.rating),1) AS averageRating,
            (
                SELECT rating
                FROM ratings
                WHERE user_id = ?
                AND store_id = s.id
            ) AS userRating
        FROM stores s
        LEFT JOIN ratings r
        ON s.id = r.store_id
        GROUP BY
            s.id,
            s.name,
            s.email,
            s.address
    `;

    db.query(
        sql,
        [userId],
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

const searchStores = (req, res) => {

    const { search } = req.query;

    const sql = `
        SELECT
            id,
            name,
            email,
            address
        FROM stores
        WHERE
            name LIKE ?
            OR address LIKE ?
    `;

    const value = `%${search}%`;

    db.query(
        sql,
        [value, value],
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
    addStore,
    getAllStores,
    searchStores
};