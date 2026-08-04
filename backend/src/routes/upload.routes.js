const express = require("express");

const upload = require("../middlewares/upload.middleware");

const { protect } = require("../middlewares/auth.middleware");

const { uploadImage } = require("../controllers/upload.controller");

const router = express.Router();

router.post(
    "/",
    protect,
    upload.single("image"),
    uploadImage
);

module.exports = router;