const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();
// send OTP
// {
//   "firstName":"Pratham",
//   "lastName":"Bagrecha",
//   "email":"prathambagrecha1430@gmail.com",
//   "password":"Pratham@123",
//   "confirmPassword":"Pratham@123",
//   "accountType":"Admin",
//   "otp":"123456"

// }
exports.sendOTP = async (req, res) => {
  //fetch email
  try {
    const { email } = req.body;

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email });
    // to be used in case of signup

    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const result = await OTP.findOne({ otp: otp });
    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result);
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body", otpBody);
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

//signup
exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
      email,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const resentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("resentOtp", resentOtp);

    //validate Otp
    if (resentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Otp is expired or not sent",
      });
    } else if (otp !== resentOtp.otp) {
      //invalid otp
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dob: null,
      contactNumber: null,
      about: null,
    });
    const user = await User.create({
      firstName,
      email,
      lastName,
      password: hashPassword,
      accountType,
      contactNumber,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    user.password = undefined;
    user.save();
    const options = {
      expire: new Date(Date.now() + 3 * 24 * 60 * 60 * 100),
      httpOnly: true,
    };
    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure , Please try later ",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Old Password",
      });
    }
    // password updation in db
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    //senad mail that word is updated
    mailSender(user.email, "Password changes Successfully");
    // return res
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the password",
    });
  }
};
