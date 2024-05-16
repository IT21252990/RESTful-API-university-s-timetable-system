const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    room: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room' 
    },
    startTime: { 
        type: String, 
        required: true 
    },
    endTime: { 
        type: String, 
        required: true 
    },
    course: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Course' 
        }
},{
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;