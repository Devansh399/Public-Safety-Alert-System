const fs = require("fs");

const cloudinary = require("../config/cloudinary");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const uploadImage = asyncHandler(async (req, res) => {

    if (!req.file) {
        throw new ApiError(400, "Image is required.");
    }

    const result = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder: "public-safety-alert-system"
        }
    );

    fs.unlinkSync(req.file.path);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Image uploaded successfully.",
            {
                imageUrl: result.secure_url
            }
        )
    );

});

module.exports = {
    uploadImage
};