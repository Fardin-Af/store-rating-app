const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
    signup,
    login,
    changePassword
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);

router.put(
    "/change-password",
    verifyToken,
    changePassword
);

module.exports = router;