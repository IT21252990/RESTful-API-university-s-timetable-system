const express = require('express');
const router = express.Router();

const {
    getAllBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingController');

const validateToken = require('../middleware/validateTokenHandler');

// get a all bookings
router.get("/" , validateToken , getAllBookings);

// create a new Booking
router.post("/", validateToken ,createBooking);

// get a single booking
router.get("/:id",validateToken , getBooking);

// update a single booking
router.put("/:id",validateToken , updateBooking);

// delete a single booking
router.delete("/:id",validateToken , deleteBooking);

module.exports = router;

