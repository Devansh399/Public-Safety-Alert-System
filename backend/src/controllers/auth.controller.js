const bcrypt = require("bcryptjs");
const validator = require("validator");

const prisma = require("../config/prisma");  

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const generateToken = require("../utils/generateToken");

const register = asyncHandler(async (req, res) => {

    const { name, email, password, phone } = req.body;

});

module.exports = {
    register
};