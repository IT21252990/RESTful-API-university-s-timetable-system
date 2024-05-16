const errorCode = require('../../errorCodes'); 

const errorHandler = (err , req , res , next) => {

    const statusCode = err.status ? err.status : 500;

    switch(statusCode){
        case errorCode.VALIDATION_ERROR :
            res.status(statusCode).json({
                title : 'Validation Error' , 
                message : err.message , 
                stackTrace : err.stack
            });
            break;
        case errorCode.NOT_FOUND :
            res.status(statusCode).json({
                title : 'Not Found', 
                message : err.message, 
                stackTrace : err.stack
            });
            break;
        case errorCode.INTERNAL_SERVER_ERROR :
            res.status(statusCode).json({
                title : 'Server Error', 
                message : err.message, 
                stackTrace : err.stack
            });
            break;
        case errorCode.UNAUTHENTICATED :
            res.status(statusCode).json({
                title : 'Unauthenticated', 
                message : err.message, 
                stackTrace : err.stack
            });
            break;
        case errorCode.FORBIDDEN :
            res.status(statusCode).json({
                title : 'Forbidden', 
                message : err.message, 
                stackTrace : err.stack
            });
            break;
        default :
            console.log("No Error, All good!");
            break;
    }
};

module.exports = errorHandler;