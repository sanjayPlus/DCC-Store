const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
    const token = req.header("x-access-token");
    if (!token) {
        return res.status(401).json({ error: "Access denied" }); // Add return here
    }
    
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

module.exports = userAuth;
