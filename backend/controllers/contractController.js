const Contract = require('../models/contracts');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');

// Create new contract => /api/v1/contract/create
exports.createContract = catchAsyncErrors (async(req, res, next) => {
    
    
        const contract = await Contract.create(req.body);
    
        res.status(201).json({
            success: true,
            contract
        })
    
})

// Get all contracts => /api/v1/contracts?keyword=apple
exports.getContracts = catchAsyncErrors(async(req, res) => {

    const resPerPage = 4;
    const contractCount = await Contract.countDocuments();

    const apiFeatures = new APIFeatures(Contract.find(), req.query)
                        .search()
                        .filter()
                        .pagination(resPerPage)

    const contracts = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: contracts.length,
        contractCount,
        contracts
    });

})

// Get contract by id => /api/v1/contract/:id
exports.getContractById = catchAsyncErrors (async(req, res, next) => {
    
        const contract = await Contract.findById(req.params.id);
    
        if (!contract) {
            return next(new ErrorHandler(`Contract not found`, 404));
        }
    
        res.status(200).json({
            success: true,
            contract
        })
    
})

// Update contract by id => /api/v1/contract/:id
exports.updateContract = catchAsyncErrors (async(req, res, next) => {

    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!contract) {
        return next(new ErrorHandler(`Contract not found`, 404));
    }

    res.status(200).json({
        success: true,
        contract
    })


})

// Delete contract by id => /api/v1/contract/:id
exports.deleteContract = catchAsyncErrors (async(req, res, next) => {

    const contract = await Contract.findById(req.params.id);

    if (!contract) {
        return next(new ErrorHandler(`Contract not found`, 404));
    }

    await Contract.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        contract
    })


})
