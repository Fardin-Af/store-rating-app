const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
    addStore,
    getAllStores,
    searchStores
} = require("../controllers/storeController");

router.post(
    "/add",
    verifyToken,
    addStore
);

router.get(
    "/search",
    verifyToken,
    searchStores
);

router.get(
    "/",
    verifyToken,
    getAllStores
);

module.exports = router;