const Course = require("../models/Course");
const Tag = require("../models/Catogery");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploder");
//create course handler function
exports.createCourse = async (req, res) => {
  try {
    const { courseName, courseDescription, whatWillYouLearn, tag, price } =
      req.body;
    const thumbnail = req.files.thumbnailImage;
    if (
      !courseName ||
      !courseDescription ||
      !whatWillYouLearn ||
      !tag ||
      !price ||
      !thumbnail
    ) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log(instructorDetails);
    if (!instructorDetails) {
      return res.status(404).json({
        message: "Instructor not found",
        success: false,
      });
    }
    //check tag is valid or not
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(404).json({
        message: "Tag not found",
        success: false,
      });
    }
    //upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    //create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });
    //add new course to the use schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse.id,
        },
      },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};

//get All Courses
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();
    return res.status(200).json({
      success: true,
      data: allCourses,
      message: "Data for all courses fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: SubSection,
        },
      })
      .exec();
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Feteched Successfully",
      data: courseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
