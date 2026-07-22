const bcrypt = require("bcryptjs");
const validator = require("validator");

const prisma = require("../config/prisma");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const generateToken = require("../utils/generateToken");

// register user
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  // pass hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
    },
  });

  const token = generateToken(user.id, user.role);

  const { password: _, ...userData } = user;

  return res.status(201).json(
    new ApiResponse(201, "User registered successfully", {
      user: userData,
      token,
    }),
  );
});

// login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Validation
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

//   Find user by email
const user = await prisma.user.findUnique({
    where: {
        email
    }
});

if (!user) {
    throw new ApiError(401, "Invalid email or password");
}

// Compare password using bcrypt.compare()

const isPasswordValid = await bcrypt.compare(password, user.password);

if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
}



//Generate JWT

const token = generateToken(user.id, user.role);


//Remove password from response

const { password: _, ...userData } = user;



//Return success response
return res.status(200).json(
    new ApiResponse(
        200,
        "Login successful",
        {
            user: userData,
            token
        }
    )
);

});

module.exports = {
  register,
  login,
};
