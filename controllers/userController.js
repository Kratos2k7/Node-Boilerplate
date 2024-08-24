const userService = require("../services/userService");
const helper = require("../helpers/common");
const { canViewUser, canEditUser, canDeleteUser, scopedUsers } = require("../rbac/permissions");
const { ROLE } = require("../rbac/roles");

const whoAmI = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!canViewUser(req.user, userId)) {
            return helper.sendResponse(res, 403, { message: "Not allowed to view this user", success: false });
        }

        const user = await userService.getUserByIdWithfields(userId);
        if (!user) return helper.sendResponse(res, 404, { message: "User not found", success: false });

        return helper.sendResponse(res, { success: true, user });
    } catch (e) {
        helper.log2File(e.message, "error");
        return helper.sendResponse(res, 500, { message: e.message, success: false });
    }
};

const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== ROLE.ADMIN && req.user.role !== ROLE.MODERATOR) {
            return helper.sendResponse(res, 403, { message: "Not allowed to view all users", success: false });
        }

        const users = await userService.getAllUsers();
        const scoped = scopedUsers(req.user, users);

        return helper.sendResponse(res, { success: true, users: scoped });
    } catch (e) {
        helper.log2File(e.message, "error");
        return helper.sendResponse(res, 500, { message: e.message, success: false });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Only admin and moderator can delete a user
        if (req.user.role !== ROLE.ADMIN && req.user.role !== ROLE.MODERATOR) {
            return helper.sendResponse(res, 403, { message: "Not allowed to delete this user", success: false });
        }

        // Check if the user has permission to delete this user
        if (!canDeleteUser(req.user, userId)) {
            return helper.sendResponse(res, 403, { message: "Not allowed to delete this user", success: false });
        }

        const deleted = await userService.deleteUser(userId);
        if (!deleted) return helper.sendResponse(res, 404, { message: "User not found", success: false });

        return helper.sendResponse(res, { success: true, message: "User successfully deleted" });
    } catch (e) {
        helper.log2File(e.message, "error");
        return helper.sendResponse(res, 500, { message: e.message, success: false });
    }
};

const editUserInfo = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if the user has permission to edit this user
        if (!canEditUser(req.user, userId)) {
            return helper.sendResponse(res, 403, { message: "Not allowed to edit this user", success: false });
        }

        const updatedUser = await userService.updateUser(userId, req.body);
        if (!updatedUser) return helper.sendResponse(res, 404, { message: "User not found", success: false });

        return helper.sendResponse(res, { success: true, user: updatedUser });
    } catch (e) {
        helper.log2File(e.message, "error");
        return helper.sendResponse(res, 500, { message: e.message, success: false });
    }
};

module.exports = {
    whoAmI,
    getAllUsers,
    deleteUser,
    editUserInfo,
};
