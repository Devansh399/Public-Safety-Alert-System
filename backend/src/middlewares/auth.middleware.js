const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");


const protect = asyncHandler(async (req, res, next) => {

});


module.exports = {
    protect
};