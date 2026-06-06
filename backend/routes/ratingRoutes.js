const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
    addRating,
    updateRating
} = require("../controllers/ratingController");

router.post(
    "/",
    verifyToken,
    addRating
);

router.put(
    "/:storeId",
    verifyToken,
    updateRating
);

module.exports = router;