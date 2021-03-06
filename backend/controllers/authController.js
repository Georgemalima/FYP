const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async(req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: '',
            url: ''
        },
        
    })

    sendToken(user, 200, res);

})

// Login a user => /api/v1/login
exports.loginUser = catchAsyncErrors(async(req, res, next) => {
    
    const { email, password } = req.body;
    // Check if email and password are provided
    if(!email || !password) {
        return next(new ErrorHandler('Please provide email and password', 400));
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if(!user) {
        return next(new ErrorHandler('Invalid user', 401));
    }

    // Check if password is correct
    const isPasswordMatched = await user.matchPassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid password', 401));
    }

    sendToken(user, 200, res);
})

// Forget password => /api/v1/forget
exports.forgotPassword = catchAsyncErrors(async(req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return next(new ErrorHandler('Invalid user', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {

        await sendEmail({
            email: user.email,
            subject: 'Smart Rent reset token',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch(err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }

})

// Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async(req, res, next) => {

    // Hash the url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Find user by token
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user) {
        return next(new ErrorHandler('Invalid token', 400));
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Passwords do not match', 400));
    }

    // Set new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

})

// Get currently logged in user => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async(req, res, next) => {
    
        const user = await User.findById(req.user.id);
    
        res.status(200).json({
            success: true,
            user
        })
    
})

// Update/Change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async(req, res, next) => {
    
    const user = await User.findById(req.user.id).select('+password');

    // check previous user password
    const isPasswordMatched = await user.matchPassword(req.body.oldPassword);
    
    if(!isPasswordMatched) {
        return next(new ErrorHandler('Old password is wrong', 401));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);

})

// Update user profile => /api/v1/me/update
exports.updateUserProfile = catchAsyncErrors(async(req, res, next) => {
        
        const newUserData = {
            name: req.body.name,
            email: req.body.email,

        }

        //Update avatar: TODO

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
    
        res.status(200).json({
            success: true,
            user
        })
    
})


// Logout a user => /api/v1/logout
exports.logoutUser = catchAsyncErrors(async(req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    })
})