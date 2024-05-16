const express = require('express');
const router = express.Router();
const {
    getAllTimetables,
    getTimetable,
    createTimetable,
    updateTimetable,
    deleteTimetable,
    getAllTimetablesByCourse
} = require("../controllers/timeTableController");
const validateToken = require('../middleware/validateTokenHandler');

// Get all timetables
router.get("/" ,getAllTimetables);

// Create a new Timetable
router.post("/", validateToken , createTimetable);

router.get("/courses" , validateToken , getAllTimetablesByCourse);

// Get a single Timetable
router.get("/:id" ,getTimetable);

// update a single Timetable
router.put("/:id" , validateToken ,updateTimetable);

// delete a single Timetable
router.delete("/:id" , validateToken ,deleteTimetable);

module.exports = router;