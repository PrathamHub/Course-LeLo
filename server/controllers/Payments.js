const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");

//capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
  //get courseId and userId
  const { courseId } = req.body;
  const userId = req.user.id;
  //validation
  if (!courseId) {
    return res.json({
      status: false,
      message: "Course Id is required",
    });
  }
  //valid courseId
  // valid course Detail
  let course;
  try {
    course = await Course.findById(courseId);
    if (!course) {
      return res.json({
        status: false,
        message: "Course not found",
      });
    }
    //user allready paid for same course
    const uid = new mongoose.Type.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(400).json({
        status: false,
        message: "Student already enrolled",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }

  //order create
  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };
  try {
    const paymentResponse = await instance.orderscreate(options);
    return res.status(200).json({
      status: true,
      message: "Payment Initiated",
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      orderId: paymentResponse.id,
      currency: paymentResponse.curreny,
      amount: paymentResponse.price,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: "Payment failed",
    });
  }
  // return res
};

exports.verifySignature = async (req, res) => {
  const webhookSecret = "123456789";
  const signature = req.headers["x-razorpay-signature"];
  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("Payment Autohrize");
    const { courseId, userId } = req.body.payload.paymententity.notes;
    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );
      if (!enrolledCourse) {
        return res.status(500).json({
          status: false,
          message: "Course not found",
        });
      }
      console.log(enrolledCourse);
      const enrolledStudent = await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { course: courseId } },
        { new: true }
      );
      console.log(enrolledStudent);

      //mail send
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congraturations, you enrolled in Pratham course",
        "You are onboarded"
      );
      return res.status(200).json({
        status: true,
        message: "Signature Verified and course Added",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "Error while adding course to student",
      });
    }
  } else {
    return res.status(400).json({
      status: false,
      message: "Invalid Signature",
    });
  }
};
