const express = require('express');
const router = express.Router();
const { 
    getAllCourses, 
    deleteCourse , 
    getCourse , 
    createCourse , 
    updateCourse,
    getAllCoursesForFaculty } = require('../controllers/courseController');
const validateToken = require('../middleware/validateTokenHandler');

// Get all courses
router.route("/" ).get(getAllCourses);

// Create a new course
router.post("/"  , validateToken , createCourse);

// Get courses related to the each faculty
router.get("/faculty" , validateToken , getAllCoursesForFaculty);

// Get a single course
router.route("/:id" ).get(getCourse);

// Update a single course
router.put("/:id" ,validateToken, updateCourse);

// delete a single course
router.delete("/:id" , validateToken  , deleteCourse);

module.exports = router;