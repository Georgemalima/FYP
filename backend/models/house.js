const mongoose = require('mongoose')
const User = require('../models/user')


const houseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'House name is required'],
        trim: true,
        maxlength: [100, 'House name must be less than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Rent price is required'],
        maxlength: [7, 'Rent price must be less than 7 characters'],
        default: 0.0
    },
    address: {
        type: String,
        trim: true,
        maxlength: [100, 'Address must be less than 100 characters']
    },
    city: {
        type: String,
        trim: true,
        maxlength: [100, 'City must be less than 100 characters']
    },
    state: {
        type: String,
        maxlength: [100, 'State must be less than 100 characters']
    },
    country: {
        type: String,
        maxlength: [100, 'Country must be less than 100 characters']
    },
    district: {
        type: String,
        maxlength: [100, 'District must be less than 100 characters']
    },
    features: {
        type: Array,
        default: []
    },
    image: {
        data: Buffer,
        contentType: String     
    },
    // add user string referring from user model
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('House', houseSchema)