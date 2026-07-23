const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");


//Authentication
const protect = asyncHandler(async (req, res, next) => {

    //Read token from headers
    const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Access denied. No token provided.");
}

const token = authHeader.split(" ")[1];

// Verify JWT
const decoded = jwt.verify(token, process.env.JWT_SECRET);

//Find user in database
const user = await prisma.user.findUnique({
    where: {
        id: decoded.id
    }
});

if (!user) {
    throw new ApiError(401, "User not found");
}

// Attach user to req.user
req.user = user;

//Call next()
next();



});

//Authorization
const authorize = (...roles) => {

    return (req, res, next) => {
       if (!roles.includes(req.user.role)) {
    throw new ApiError(
        403,
        "You are not authorized to perform this action"
    );
}

next();
    };

};

module.exports = {
    protect,
    authorize
};