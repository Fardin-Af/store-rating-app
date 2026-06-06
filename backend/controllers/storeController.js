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

    const sql = `
    SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        ROUND(AVG(r.rating),1) AS averageRating
    FROM stores s
    LEFT JOIN ratings r
    ON s.id = r.store_id
    GROUP BY
        s.id,
        s.name,
        s.email,
        s.address
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

const searchStores = (req, res) => {

    const { name } = req.query;

    const sql = `
        SELECT
            id,
            name,
            email,
            address
        FROM stores
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
    addStore,
    getAllStores,
    searchStores
};