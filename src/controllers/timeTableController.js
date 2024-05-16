const asyncHandler = require("express-async-handler");
const Timetable = require("../models/timeTableModel");
const User = require("../models/userModel");
const Course = require("../models/courseModel");

//@desc Get All Time Tables
//@route /api/timetables/
//@access public
const getAllTimetables = asyncHandler(async (req, res) => {
  const timetables = await Timetable.find();
  res.status(200).json(timetables);
});

//@desc Get a Single Time Table
//@route /api/timetables/:id
//@access public
const getTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);
  if (!timetable) {
    res.status(404);
    throw new Error("Time table not found");
  }
  res.status(200).json(timetable);
});

//@desc Create new Time Tables
//@route /api/timetables/
//@access private
const createTimetable = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check for overlap before creating a new entry
  const hasOverlap = await checkForOverlap(req.body);
  if (hasOverlap) {
    res.status(400);
    throw new Error("Timetable overlaps with an existing Timetable");
  }

  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403);
    throw new Error("Only admins can access this route");
  } else {
    const { course, dayOfWeek, startTime, endTime, location } = req.body;

    if (!course || !dayOfWeek || !startTime || !endTime || !location) {
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

    const timeTable = await Timetable.create({
      course,
      dayOfWeek,
      startTime,
      endTime,
      location,
    });

    res.status(201).json(timeTable);
  }
});

//@desc Update a Single Time Table
//@route /api/timetables/:id
//@access private
const updateTimetable = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check for overlap before creating a new entry
  const hasOverlap = await checkForOverlap(req.body);
  if (hasOverlap) {
    res.status(400);
    throw new Error("Timetable overlaps with an existing Timetable");
  }

  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403); // Forbidden
    throw new Error("Only admins can access this route");
  } else {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      res.status(404);
      throw new Error("Time table not found");
    }

    const updatedTimetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTimetable);
  }
});

//@desc Delete a Single Time Table
//@route /api/timetables/:id
//@access private
const deleteTimetable = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403);
    throw new Error("Only admins can access this route");
  } else {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      res.status(404);
      throw new Error("Time table not found");
    }
    await Timetable.deleteOne();
    res.status(200).json(timetable);
  }
});

// Check if there is any overlap in the timetable schedule
const checkForOverlap = async (timetableData) => {
  const { course, dayOfWeek, startTime, endTime } = timetableData;
  const existingTimetableEntries = await Timetable.find({ course, dayOfWeek });

  for (const entry of existingTimetableEntries) {
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

//@desc Get all Timetables associated with the given course
//@route /api/timetables/courses
//@access private
const getAllTimetablesByCourse = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Faculty") {
    res.status(403);
    throw new Error("Only Faculty members can access this route");
  } else {
    const facultyId = req.user.id;

    try {
      const courses = await Course.find({ faculty: facultyId });

      let timetables = [];

      // Iterate through each course and fetch its timetable
      for (const course of courses) {
        const timetable = await Timetable.findOne({ course: course._id });

        // If timetable for the course exists, push it to the array
        if (timetable) {
          timetables.push(timetable);
        }
      }
      res.status(200).json({timetables });
    } catch (error) {
      res.status(500);
      throw new Error("Error fetching timetables");
    }
  }
});

module.exports = {
  getAllTimetables,
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  getAllTimetablesByCourse
};
