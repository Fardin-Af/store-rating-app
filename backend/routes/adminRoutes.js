const express = require("express");

const router = express.Router();

const {
    getDashboard,
    getAllUsers,
    getUserById,
    searchUsers
} = require("../controllers/adminController");

const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isadmin");

router.get(
    "/dashboard",
    verifyToken,
    isAdmin,
    getDashboard
);

router.get(
    "/users",
    verifyToken,
    isAdmin,
    getAllUsers
);
router.get(
    "/users/search",
    verifyToken,
    isAdmin,
    searchUsers
);

router.get(
    "/users/:id",
    verifyToken,
    isAdmin,
    getUserById
);

module.exports = router;