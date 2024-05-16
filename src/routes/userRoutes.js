const express = require('express');
const router = express.Router();
const { registerUser , loginUser , currentuser } = require('../controllers/userController');
const validateToken = require('../middleware/validateTokenHandler');


// route to register new user
router.post("/register" , registerUser);

// route to login
router.post("/login" , loginUser);

// route to get information about current user
router.get("/currentuser" ,validateToken, currentuser);

module.exports = router;