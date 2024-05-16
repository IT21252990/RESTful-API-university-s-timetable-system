const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');


const validateToken = asyncHandler( async(req , res , next) => {
    let token;
    let authHeader;
    authHeader = req.headers.authorization || req.headers.Authorization;

    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        jwt.verify(token , process.env.ACCESS_TOKEN_SECRET_KEY , (err , decoded) => {
            if(err){
                res.status(401);
                throw new Error("User is not authorized to access");
            }
            req.user = decoded.user;
            next();
        }); 

        if(!token){
            res.status(401);
            throw new Error("User is not authorized or Token is invalid");
        }
    }
    if(!token){
        res.status(401);
        throw new Error("User is not authorized");
    }
});

module.exports = validateToken;