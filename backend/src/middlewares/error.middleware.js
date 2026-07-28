// const errorHandler = (err, req, res, next) => {

//     const statusCode = err.statusCode || 500;

//     res.status(statusCode).json({
//         success: false,
//         statusCode,
//         message: err.message || "Internal Server Error"
//     });

// };

// module.exports = errorHandler;



//temporary
const errorHandler = (err, req, res, next) => {

    console.error("\n========== ERROR ==========");
    console.error(err);
    console.error("===========================\n");

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        statusCode,
        message: err.message || "Internal Server Error"
    });
};

module.exports = errorHandler;