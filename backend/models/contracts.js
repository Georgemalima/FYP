const mongoose = require('mongoose');

// create contracts schema
const contractSchema = new mongoose.Schema({

    tenant: {
        type: String,
        required: [true, 'Tenant is required'],
        trim: true
    },
    // link house by id
    house: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',
        required: [true, 'House is required']
    },
    durationOfContract: {
        type: Number,
        required: [true, 'Duration of contract is required'],
        maxlength: [7, 'Duration of contract must be less than 7 characters'],
        default: 0.0
    },
    monthlyRent: {
        type: Number,
        required: [true, 'Monthly rent is required'],
        maxlength: [7, 'Monthly rent must be less than 7 characters'],
        default: 0.0
    },
    totalRent: {
        type: Number,
        required: [true, 'Total rent is required'],
        maxlength: [7, 'Total rent must be less than 7 characters'],
        default: 0.0
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']

    },
    contractStatus: {
        type: String,
        required: [true, 'Contract status is required'],
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    

})

module.exports = mongoose.model('Contract', contractSchema);