const asyncHandler = require("express-async-handler");
const Enrollment = require("../models/enrollmentModel");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const TimeTable = require("../models/timeTableModel");

//@desc Get All Enrollment
//@route /api/enrollments/
//@access public
const getAllEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.find();
  res.status(200).json(enrollment);
});

//@desc Get a single enrollment
//@route /api/enrollments/:id
//@access public
const getEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) {
    res.status(404);
    throw new Error("Enrollment not found");
  }
  res.status(200).json(enrollment);
});

//@desc create a Enrollment
//@route /api/enrollments/
//@access private
const createEnrollment = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check if the authenticated user exists and has the role of 'Student'
  if (!user || user.role !== "Student") {
    res.status(403);
    throw new Error("Only Students can access this route");
  } else {
    const { course } = req.body;
    if (!course) {
      res.status(404);
      throw new Error(" All fields are required");
    }
    // Check if Course exists in the database
    const courseExists = await Course.exists({
      _id: req.body.course,
    });
    if (!courseExists) {
      res.status(404);
      throw new Error("Course not found");
    }

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course,
    });

    res.status(201).json(enrollment);
  }
});

//@desc delete an Enrollment
//@route /api/enrollment/:id
//@access private
const deleteEnrollment = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check if the authenticated user exists and has the role of 'Student'
  if (!user || user.role !== "Student") {
    res.status(403);
    throw new Error("Only Student can access this route");
  } else {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      res.status(404);
      throw new Error("Enrollment not found");
    }

    await Enrollment.deleteOne();
    res.status(200).json(enrollment);
  }
});

//@desc Get All Enrollments by each Student
//@route /api/enrollments/true
//@access private
const getAllEnrollmentByStudent = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check if the authenticated user exists and has the role of 'Student'
  if (!user || user.role !== "Student") {
    res.status(403);
    throw new Error("Only Student can access this route");
  } else {
    const enrollment = await Enrollment.find({ student: req.user.id });
    res.status(200).json(enrollment);
  }
});

//@desc Get all Timetables associated with the given course that student enrolled
//@route /api/enrollments/true/timetables
//@access private
const getAllTimetablesByStudentEnrolled = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check if the authenticated user exists and has the role of 'Student'
  if (!user || user.role !== "Student") {
    res.status(403);
    throw new Error("Only Student members can access this route");
  } else {
    const studentId = req.user.id;
    try {
        const enrollments = await Enrollment.find({ student: studentId });

      let timetables = [];

      // Iterate through each course and fetch its timetable
      for (const Enrollment of enrollments) {
        const timetable = await TimeTable.findOne({ course: Enrollment.course });

        // If timetable for the course exists, push it to the array
        if (timetable) {
          timetables.push(timetable);
        }
      }
      res.status(200).json({ timetables });
    } catch (error) {
      res.status(500);
      throw new Error("Error fetching timetables");
    }
  }
});

module.exports = {
  getAllEnrollment,
  getEnrollment,
  createEnrollment,
  deleteEnrollment,
  getAllEnrollmentByStudent,
  getAllTimetablesByStudentEnrolled
};
