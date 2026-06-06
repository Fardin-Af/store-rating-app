const isOwner = (req, res, next) => {

    if (req.user.role !== "OWNER") {
        return res.status(403).json({
            message: "Access denied. Owner only."
        });
    }

    next();
};

module.exports = isOwner;