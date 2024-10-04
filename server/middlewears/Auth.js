const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Berrer", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }
    //verify the token
    try {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Something went wrong while validation the token",
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountTpe !== "Student") {
      return res.status(401).json({
        success: false,
        message: "You are not a student",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountTpe !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "You are not a Instructor",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountTpe !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "You are not a Admins",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, please try again",
    });
  }
};
