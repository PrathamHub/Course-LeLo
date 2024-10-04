const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploder");
exports.updateProfile = async (req, res) => {
  try {
    //get data
    const { gender, dob, about, contactNumber } = req.body;
    //get user id
    const id = req.user.id;
    //validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }
    //find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);
    //update profile
    profileDetails.dob = dob;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();
    // return res
    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      profileDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error updating profile",
      success: false,
      error: error.message,
    });
  }
};

//delete account
exports.deleteAccount = async (req, res) => {
  try {
    //get id
    const id = req.user.id;
    //validation
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    //delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    //delete user
    await User.findByIdAndDelete({ _id: id });
    //return res
    return res.status(200).json({
      message: "User deleted successfullt",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error deleting user",
      success: false,
      error: error.message,
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id).populate("additionalDetails").exec();
    return res.status(200).json({
      message: "User details retrieved successfully",
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving user details",
      success: false,
      error: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updateProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updateProfile,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
