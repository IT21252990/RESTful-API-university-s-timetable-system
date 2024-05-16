const asyncHandler = require("express-async-handler");
const Bookings = require("../models/bookingModel");
const Course = require("../models/courseModel");
const Room = require("../models/roomModel");
const User = require("../models/userModel");

//@desc Get All Booking
//@route /api/bookings/
//@access private
const getAllBookings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403);
    throw new Error("Only admins can access this route");
  } else {
    const bookings = await Bookings.find();
    res.status(200).json(bookings);
  }
});

//@desc Get a Single Booking
//@route /api/bookings/:id
//@access private
const getBooking = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403);
    throw new Error("Only admins can access this route");
  } else {
    const booking = await Bookings.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }
    res.status(200).json(booking);
  }
});

//@desc Create new Booking
//@route /api/bookings/
//@access private
const createBooking = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403);
    throw new Error("Only admins can access this route");
  } else {
    // Check for overlap before creating a new Booking
    const hasOverlap = await checkForOverlap(req.body);
    if (hasOverlap) {
      res.status(400);
      throw new Error("This Booking overlaps with an existing Booking");
    }

    const { room, startTime, endTime, course } = req.body;

    if (!room || !startTime || !endTime || !course) {
      res.status(404);
      throw new Error(" All fields are required");
    }

    // Check if entered course exists in the database
    const courseExists = await Course.exists({
      _id: req.body.course,
    });
    if (!courseExists) {
      res.status(404);
      throw new Error("Can not find Entered Course");
    }

    // Check if entered room exists in the database
    const roomExists = await Room.exists({
      _id: req.body.room,
    });
    if (!roomExists) {
      res.status(404);
      throw new Error("Can not find Entered Room");
    }

    const booking = await Bookings.create({
      room,
      startTime,
      endTime,
      course,
    });

    res.status(201).json(booking);
  }
});

//@desc Update a Single Booking
//@route /api/bookings/:id
//@access private
const updateBooking = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403);
    throw new Error("Only admins can access this route");
  } else {
    // Check for overlap before creating a new entry
    const hasOverlap = await checkForOverlap(req.body);
    if (hasOverlap) {
      res.status(400);
      throw new Error("This Booking overlaps with an existing Booking");
    }
    const booking = await Bookings.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    const updatedBooking = await Bookings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedBooking);
  }
});

//@desc Delete a Single Booking
//@route /api/bookings/:id
//@access private
const deleteBooking = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403);
    throw new Error("Only admins can access this route");
  } else {
    const booking = await Bookings.findById(req.params.id);
    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }
    await Bookings.deleteOne();
    res.status(200).json(booking);
  }
});

// Check if there is any overlap in the Booking schedule
const checkForOverlap = async (BookingData) => {
  const { room, startTime, endTime, course } = BookingData;
  const existingBookingEntries = await Bookings.find({ room });

  for (const entry of existingBookingEntries) {
    if (
      (startTime >= entry.startTime && startTime < entry.endTime) ||
      (endTime > entry.startTime && endTime <= entry.endTime) ||
      (startTime <= entry.startTime && endTime >= entry.endTime)
    ) {
      return true; // Overlap detected
    }
  }
  return false; // No overlap
};

module.exports = {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
};
