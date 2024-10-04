const RatingAndReviews = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }
    const alreadyReviewed = await RatingAndReviews.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(403).json({
        message: "You have already reviewed this course",
        success: false,
      });
    }
    const userReview = await RatingAndReviews.create({
      user: userId,
      rating,
      review,
      course: courseId,
    });
    const updatedCourseDetails = await Course.findById(
      { _id: courseId },
      { $push: { RatingAndReviews: userReview._id } },
      { new: true }
    );
    console.log(updatedCourseDetails);

    return res.status(200).json({
      success: true,
      message: "Rating and review created successfully",
      userReview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    //get course id
    const courseId = req.body.courseid;
    //calculate average rating
    const result = await RatingAndReviews.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    //return rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Average rating retrieved successfully",
        averageRating: result[0].averageRating,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Average rating in zero",
      averageRating: 0,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllRating = async (req, res) => {
  try {
    const allReview = await RatingAndReviews.find({})
      .sort({ rating: "desc" })
      .populate({ path: "user", select: "firstName lastName email image" })
      .populate({ path: "course", select: "courseName" })
      .exec();
    return res.status(200).json({
      success: true,
      message: "All ratings retrieved successfully",
      data: allReview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
