const { ROLE } = require('./roles');
const ObjectID = require('mongoose').Types.ObjectId;

function canViewUser(user, userId) {
    return (
        user.role === ROLE.ADMIN ||
        user.role === ROLE.MODERATOR ||
        user.id == userId
    );
}

function canEditUser(user, userId) {
    return (
        user.role === ROLE.ADMIN || user.id == userId
    );
}

function canDeleteUser(user, userId) {
    return user.role === ROLE.ADMIN;
}

function scopedUsers(user, users) {
    if (user.role === ROLE.ADMIN) return users;
    if (user.role === ROLE.MODERATOR) return users.filter(u => u.role === ROLE.USER);
    
    return users.filter(u => u.id == user.id);
}

module.exports = {
    canViewUser,
    canEditUser,
    canDeleteUser,
    scopedUsers
};
