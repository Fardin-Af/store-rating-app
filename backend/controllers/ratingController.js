const db = require("../config/db");

const addRating = (req, res) => {

    const user_id = req.user.id;

    const { store_id, rating } = req.body;

    const sql = `
        INSERT INTO ratings(
            user_id,
            store_id,
            rating
        )
        VALUES(?,?,?)
    `;

    db.query(
        sql,
        [user_id, store_id, rating],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Rating submitted successfully"
            });

        }
    );

};
const updateRating = (req, res) => {

    const user_id = req.user.id;

    const store_id = req.params.storeId;

    const { rating } = req.body;

    const sql = `
        UPDATE ratings
        SET rating = ?
        WHERE user_id = ?
        AND store_id = ?
    `;

    db.query(
        sql,
        [rating, user_id, store_id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(200).json({
                message: "Rating updated successfully"
            });

        }
    );

};

module.exports = {
    addRating,
    updateRating
};