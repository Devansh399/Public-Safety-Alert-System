const express = require("express");

const router = express.Router();

router.post("/register", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Register API Working"
    });
});

router.post("/login", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Login API Working"
    });
});

module.exports = router;