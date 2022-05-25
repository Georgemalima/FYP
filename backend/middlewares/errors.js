const ErrorHandler = require('../utils/errorHandler');


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    
    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err }

        error.message = err.message;

        //Wrong Mongoose Object Id Error
        if (err.name === 'CastError') {
            const message = `Resource not found with id of ${err.path}`;
            error = new ErrorHandler(message, 400);
        }   

        //Handling Mongoose Validation Error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);
        }

        //Handling Mongoose Duplicate key Error
        if (err.code === 11000) {
            //const message specify object key
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            error = new ErrorHandler(message, 400);
        }

        //Handling wrong JWT Token
        if (err.name === 'JsonWebTokenError') {
            const message = 'Invalid token, Try Again!!';
            error = new ErrorHandler(message, 401);
        }

        //Handling Expired JWT Token
        if (err.name === 'TokenExpiredError') {
            const message = 'Token expired, Try Again!!';
            error = new ErrorHandler(message, 401);
        }


        res.status(err.statusCode).json({
        success: false,
        error: err.message || 'Internal Server Error'
        })
    }

}