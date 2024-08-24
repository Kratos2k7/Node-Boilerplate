const authService = require("../services/authService");
const userService = require("../services/userService");
const { v4: uuidv4 } = require("uuid");
const helper = require("../helpers/common");
const dirHelper = require("../helpers/DIR_helper");
const config = require("../config/keys");
const tokenService = require("../services/tokenService");
const { checkRefreshToken } = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
var jwtDecode = require("jwt-decode");

const register = async (req, res) => {
    try {
      const data = ({
        email,
        username,
        firstName,
        lastName,
        password,
        mobile_number,
      } = req.body);
  
      let user = await userService.getUserByEmail(data.email);
      if (user) {
        return helper.sendResponse(res, {
          success: false,
          message:
            "Registration failed. User with this email already registered.",
        });
      }
  
      Object.assign(data, {
        username: `${firstName}_${lastName}_${uuidv4()}`,
        isVerified: true,
      });
  
      user = await userService.addUser(data);
      if (user.err) {
        return helper.sendResponse(res, {
          success: false,
          message: "Account Registration failed",
          err: user.err,
        });
      }
  
      await dirHelper.createDIR(`${config.directories.uploadsPrivate}/${user._id}`);
  
      return helper.sendResponse(res, {
        success: true,
        message: "Account registered successfully.",
      });
    } catch (e) {
      helper.prettyLog(`catching ${e}`);
      helper.log2File(e.message, "error");
      return helper.sendResponse(res, 500, {
        message: e.message,
        success: false,
      });
    }
  };

const refresh = async (req, res) => {
  try {
    const decoded = helper.decodeToken(req);
    const check = checkRefreshToken(decoded, res);
    let user = await userService.getUserByField({ email: decoded.email });
    
    if (!user || !check)
      return helper.sendResponse(res, {
        success: false,
        message: "Invalid token",
      });

    const payload = {
      email: decoded.email,
      id: decoded.id,
      time: new Date(),
    };
    let refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
      algorithm: config.REFRESH_TOKEN_ALGO,
      expiresIn: config.REFRESH_TOKEN_LIFE,
    });
    Object.assign(payload, { refreshToken });

    var token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.tokenExpireTime,
    });

    return helper.sendResponse(res, { success: true, data: { token } });
  } catch (error) {
    helper.prettyLog(error);
    helper.log2File(error.message, "error");
    return helper.sendResponse(res, 500, {
      success: false,
      message: error.message,
    });
  }
};

const resendToken = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email || "");

    if (!user)
      return helper.sendResponse(res, {
        message: `This email address is not associated with any account. Double-check your email address and try again.`,
      });

    if (user.isVerified)
      return helper.sendResponse(res, {
        message: "This account has already been verified. Please log in.",
      });

    return helper.sendResponse(res, {
      success: true,
      message: "Token has been resent.",
    });
  } catch (error) {
    helper.log2File(error.message, "error");
    return helper.sendResponse(res, 500, {
      message: error.message,
      success: false,
    });
  }
};

const verify = async (req, res) => {
    try {
      const { userId } = req.body; 
  
      const user = await userService.getUserByID(userId);
      if (!user) {
        return helper.sendResponse(res, {
          message: "Account not registered",
          success: false,
        });
      }
  
      if (user.isVerified) {
        return helper.sendResponse(res, {
          message: "This account has already been verified.",
          success: false,
        });
      }
  
      await userService.updateUser(userId, { isVerified: true });
  
      return helper.sendResponse(res, {
        success: true,
        message: "Account has been successfully verified.",
      });
    } catch (error) {
      helper.log2File(error.message, "error");
      return helper.sendResponse(res, 500, {
        message: error.message,
        success: false,
      });
    }
  };

const login = async (req, res) => {
  try {
    return await authService
      .authenticate(req.body)
      .then((token) => {
        helper.sendResponse(res, { success: true, data: { token } });
      })
      .catch((err) => {
        helper.prettyLog(err);
        helper.log2File(err.message, "error");
        helper.sendResponse(res, { success: false, message: err.message });
      });
  } catch (error) {
    helper.prettyLog(error);
    helper.log2File(error.message, "error");
    return helper.sendResponse(res, 500, {
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
  register,
  refresh,
  resendToken,
  verify,
};
