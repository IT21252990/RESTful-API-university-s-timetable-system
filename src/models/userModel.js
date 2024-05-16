const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['Admin' , 'Faculty' , 'Student'],
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : [true , "Email Address already taken" ]
    }
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;