const User = require('../models/user');
var ObjectID = require('mongoose').Types.ObjectId; 

const hiddenFields = ['-password'];

const addUser = async data => { return await new User(data).save() }

const getUserByEmail = async email => { return User.findOne({email}) }

const getUserByID = async id => {return await User.findById(id)}

const getUserByIdWithfields = async (id, fields) => { return await User.findById(id).select(fields).select(hiddenFields) }

const getUserByEmailWithFields = async (email, fields) => { return await User.findOne({email}).select(fields) }
const getUsersByRole = async role => { return await User.find({ role }).select(hiddenFields); };
const getAllUsers = async () => { return await User.find().select(hiddenFields); };


const updateUser = async (id, update,select) => {
    return await User.findOneAndUpdate({_id: ObjectID(id)}, update, {
        new: true
    }).select(select).select(hiddenFields)
}

const generateVerificationToken = async (user) => {
    const token = user.generateVerificationToken()
    return await token.save() 
}

const getUserByField = async field => {
    return await User.findOne(field)
}

module.exports = {
    addUser,
    getUserByEmail,
    getUserByID,
    getUserByIdWithfields,
    updateUser,
    getAllUsers,
    getUsersByRole,
    generateVerificationToken,
    getUserByField,
    getUserByEmailWithFields,
}


