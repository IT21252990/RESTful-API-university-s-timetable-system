const express = require('express');
const router = express.Router();

const {
    getAllRooms,
    deleteRoom,
    getRoom,
    createRoom,
    updateRoom
} = require('../controllers/roomController');

const validateToken = require('../middleware/validateTokenHandler');


// Get all rooms
router.get("/" , validateToken , getAllRooms);

// Create a new course
router.post("/" , validateToken , createRoom);

// Get a single room
router.get("/:id" , validateToken , getRoom);

// Update a single room
router.put("/:id" ,validateToken, updateRoom);

// delete a single room
router.delete("/:id" ,validateToken, deleteRoom);

module.exports = router;