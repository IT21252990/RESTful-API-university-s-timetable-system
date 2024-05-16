const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({

    name: { 
        type: String, 
        required: true 
    },
    code: { 
        type: String, 
        required: true 
    },
    description: {
        type : String
    },
    credits: {
        type : Number
    },
    faculty: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
},{
  timestamp: true
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;