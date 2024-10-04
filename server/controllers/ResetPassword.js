const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const token = crypto.randomBytes(20).toString("hex");
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    console.log("DETAILS", updatedDetails);
    const url = `http://localhost:3000/update-password/${token}`;
    await mailSender(email, `Password reset link","Password reset link:${url}`);
    return res.json({
      success: false,
      message: "Password reset link sent to your email",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword, token } = req.body;
    //validate
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Passwords do not match",
      });
    }
    const userDetails = await User.findOne({ token: token });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Invalid token",
      });
    }
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true }
    );
    res.json({
      success: true,
      message: `Password Reset Successful`,
    });
  } catch (error) {
    return res.json({
      error: error.message,
      success: false,
      message: `Some Error in Updating the Password`,
    });
  }
};
