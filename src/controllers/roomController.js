const asyncHandler = require("express-async-handler");
const Room = require("../models/roomModel");
const Bookings = require("../models/bookingModel");
const User = require("../models/userModel");

//@desc Get All Rooms
//@route /api/rooms
//@access private
const getAllRooms = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403);
    throw new Error("Only admins can access this route");
  } else {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  }
});

//@desc Get a single Rooms
//@route /api/rooms/:id
//@access private
const getRoom = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403);
    throw new Error("Only admins can access this route");
  } else {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }
    res.status(200).json(room);
  }
});

//@desc Create a single Rooms
//@route /api/rooms
//@access private
const createRoom = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403);
    throw new Error("Only admins can access this route");
  } else {
    const { name, capacity, resources, bookings } = req.body;
    if (!name || !capacity || !resources || !bookings) {
      res.status(404);
      throw new Error(" All fields are required");
    }

    const room = await Room.create({
      name,
      capacity,
      resources,
      bookings,
    });

    res.status(201).json(room);
  }
});

//@desc Update a room
//@route /api/room/:id
//@access private
const updateRoom = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403);
    throw new Error("Only admins can access this route");
  } else {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedRoom);
  }
});

//@desc delete a Room
//@route /api/room/:id
//@access private
const deleteRoom = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403);
    throw new Error("Only admins can access this route");
  } else {
    const room = await Room.findById(req.params.id);
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }

    await Room.deleteOne();
    res.status(200).json(room);
  }
});

module.exports = {
  getAllRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
};
