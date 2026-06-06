const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const isOwner = require("../middleware/isOwner");

const {
    getOwnerDashboard
} = require("../controllers/ownerController");

router.get(
    "/dashboard",
    verifyToken,
    isOwner,
    getOwnerDashboard
);

module.exports = router;