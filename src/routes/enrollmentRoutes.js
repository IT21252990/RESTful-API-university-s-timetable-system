const express = require('express');
const router = express.Router();

const {
    getAllEnrollment,
    getEnrollment,
    createEnrollment,
    deleteEnrollment,
    getAllEnrollmentByStudent,
    getAllTimetablesByStudentEnrolled
} = require('../controllers/enrollmentController');

const validateToken = require('../middleware/validateTokenHandler');

// Get all Enrollments
router.get("/" , validateToken , getAllEnrollment);

// Get all Enrollment by Student
router.get("/true" , validateToken , getAllEnrollmentByStudent);

// Get all timetables related to the courses witch are enrolled by Student
router.get("/true/timetables" , validateToken , getAllTimetablesByStudentEnrolled);

// Create a new Enrollment
router.post("/", validateToken , createEnrollment);

// Get a single Enrollment
router.get("/:id" ,validateToken , getEnrollment);

// delete a single Enrollment
router.delete("/:id" , validateToken ,deleteEnrollment);

module.exports = router;