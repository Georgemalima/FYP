const House = require('../models/house');
const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');

//Create new house => /api/v1/house/create
exports.createHouse = catchAsyncErrors (async(req, res, next) => {

 //request user mongoose id from user model and assign it to the house model
    req.body.user = req.user.id;

    const house = await House.create(req.body);

    res.status(201).json({
        success: true,
        house
    })

})


// Get all houses => /api/v1/houses?keyword=apple

exports.getHouses = catchAsyncErrors(async(req, res) => {

    const resPerPage = 4;
    const houseCount = await House.countDocuments();

    const apiFeatures = new APIFeatures(House.find(), req.query)
                        .search()
                        .filter()
                        .pagination(resPerPage)

    const houses = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: houses.length,
        houseCount,
        houses
    });
})

// Get house by id => /api/v1/house/:id

exports.getHouseById = catchAsyncErrors (async(req, res, next) => {

    const house = await House.findById(req.params.id);

    if (!house) {
        return next(new ErrorHandler(`House not found`, 404));
    }

    res.status(200).json({
        success: true,
        house
    })

})

// Update house => /api/v1/house/:id
exports.updateHouse = catchAsyncErrors (async(req, res) => {

    let house = await House.findById(req.params.id);

    if (!house) {
        return next(new ErrorHandler(`House not found`, 404));
    }
    
    house = await House.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        house
    })
})

// Delete house => /api/v1/house/:id

exports.deleteHouse = catchAsyncErrors (async(req, res, next) => {

    const house = await House.findById(req.params.id);

    if (!house) {
        return next(new ErrorHandler(`House not found`, 404));
    }

    await House.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'House deleted'
    })

})