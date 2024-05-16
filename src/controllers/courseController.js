const asyncHandler = require("express-async-handler");

const Course = require("../models/courseModel");
const User = require("../models/userModel");

//@desc Get All Courses
//@route /api/courses/
//@access public
const getAllCourses = asyncHandler(async (req, res) => {
  const Courses = await Course.find();
  res.status(200).json(Courses);
});

//@desc Get a single Course
//@route /api/courses/:id
//@access public
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  res.status(200).json(course);
});

//@desc create a Course
//@route /api/courses/
//@access private
const createCourse = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403); 
    throw new Error("Only admins can access this route");
  } else {
    const { name, code, description, credits, faculty } = req.body;
    if (!name || !code || !description || !credits || !faculty) {
      res.status(404);
      throw new Error(" All fields are required");
    }

    // Check if assignedFaculty exists in the database
    const facultyExists = await User.exists({
      _id: req.body.faculty,
      role: "Faculty",
    });
    if (!facultyExists) {
      res.status(404);
      throw new Error("Faculty not found");
    }

    const course = await Course.create({
      name,
      code,
      description,
      credits,
      faculty,
    });

    res.status(201).json(course);
  }
});

//@desc Update a Course
//@route /api/courses/:id
//@access private
const updateCourse = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403); // Forbidden
    throw new Error("Only admins can access this route");
  } else {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedCourse);
  }
});

//@desc delete a Course
//@route /api/courses/:id
//@access private
const deleteCourse = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Admin") {
    res.status(403);
    throw new Error("Only admins can access this route");
  } else {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    await Course.deleteOne();
    res.status(200).json(course);
  }
});

//@desc Get All Courses associated with each Faculty
//@route /api/courses/faculty
//@access private
const getAllCoursesForFaculty = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // Check if the authenticated user exists and has the role of 'Admin'
  if (!user || user.role !== "Faculty") {
    res.status(403);
    throw new Error("Only Faculty members can access this route");
  } else {
    const facultyId = req.user.id;

    const courses = await Course.find({ faculty: facultyId });

    if (!courses || courses.length === 0) {
      res.status(404);
      throw new Error("No courses found assigned to this faculty member");
    }

    res.status(200).json(courses);
  }
});

module.exports = {
  getAllCourses,
  deleteCourse,
  getCourse,
  createCourse,
  updateCourse,
  getAllCoursesForFaculty,
};
