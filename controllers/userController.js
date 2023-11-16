const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const {attachCookiesToResponse, createTokenUser, checkPermissions} = require('../utils');


const getAllUsers = async (req, res) => {
    console.log(req.user)

    const users = await User.find({role: 'user'}).select('-password');
    res.status(StatusCodes.OK).json({users});
};

const getSingleUser = async (req, res) => {    
    const user = await User.findOne({_id: req.params.id}).select('-password');
    if (!user) {
        throw new CustomError.NotFoundError('User is not found');
    };
    checkPermissions(req.user, user._id);

    res.status(StatusCodes.OK).json({user});
};

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user});
};

// update user with findOneAndUpdate() method.
// const updateUser = async (req, res) => {
//     const {name, email} = req.body;

//     if (!name || !email) {
//         throw new CustomError.BadRequestError('Please provide name and email.')
//     };

//     const user = await User.findOneAndUpdate(
//         {_id: req.user.userId}, 
//         {name, email}, 
//         {new: true, runValidators: true},
//     );

//     const tokenUser = createTokenUser(user);
//     attachCookiesToResponse({res, user: tokenUser});

//     res.status(StatusCodes.OK).json({user: tokenUser});
// };

// update user with user.save() method.
const updateUser = async (req, res) => {
    const {name, email} = req.body;

    if (!name || !email) {
        throw new CustomError.BadRequestError('Please provide name and email.')
    };

    const user = await User.findOne({_id: req.user.userId});
    user.email = email;
    user.name = name;

    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res, user: tokenUser});

    res.status(StatusCodes.OK).json({user: tokenUser});
};

const updateUserPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide password.')
    };

    const user = await User.findOne({_id: req.user.userId});
    const isOldPasswordValid = await user.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
        throw new CustomError.UnauthenticatedError('Incorrect password');
    };
    user.password = newPassword;
    await user.save()

    res.status(StatusCodes.OK).json({user, msg: 'Password changed!'})
};


module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
}
