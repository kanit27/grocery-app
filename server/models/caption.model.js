const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const captionSchema = new mongoose.Schema({
    fullname:{
        firstname : {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname : {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ],

    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    vehicle:{
        color:{
            type: String,
            required: true,
            minlength: [3, 'Color must be at least 3 characters long'],
        },
        plate:{
            type: String,
            required: true,
            minlength: [3, 'Plate must be at least 3 characters long'],
            unique: true,
        },
        capacity:{
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        vehicleType:{
            type: String,
            enum: ['car', 'motorcycle', 'auto'],
            required: true,
        },
        vehicleModel:{
            type: String,
            required: true,
            minlength: [3, 'Vehicle model must be at least 3 characters long']
        },
    },
    location:{
        latitude:{
            type: Number,       
            min: -90,
            max: 90,
        },
        longitude:{
            type: Number,
            min: -180,
            max: 180,
        },
        timestamp:{
            type: Date,
            default: Date.now,
        },

    },

});

captionSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

captionSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

captionSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});




const captionModel = mongoose.model('caption', captionSchema);

module.exports = captionModel;