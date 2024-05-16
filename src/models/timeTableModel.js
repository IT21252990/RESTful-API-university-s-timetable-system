const mongoose = require('mongoose');

const timeTableSchema = mongoose.Schema({
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
    },
    dayOfWeek: { 
        type: String, 
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    location: {
        type: String
    }
});

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTable;