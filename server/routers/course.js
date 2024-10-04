const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseDetails,
} = require("../controllers/Course");

const {
  createCategory,
  categoryPageDetails,
  getAllCatogries,
} = require("../controllers/Category");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");
const {
  createSubSection,
  updatedsubSection,
  deleteSubSection,
} = require("../controllers/SubSection");
const {
  createRating,
  getAllRating,
  getAverageRating,
} = require("../controllers/RatingAndReview");
const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../middlewears/Auth");
router.post("/createCourse", auth, isInstructor, createCourse);
// Edit Course routes
// router.post("/editCourse", auth, isInstructor, );
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// Edit Sub Section
// router.post("/updateSubSection", auth, isInstructor, updatedsubSection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);
// Get all Courses Under a Specific Instructor
// router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getAllCourses);
// To Update Course Progress
// router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);
// To get Course Progress
// router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)
// Delete a Course
// router.delete("/deleteCourse", deleteCourse);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
// router.post("/createCategory", auth, isAdmin, createCategory);
// router.get("/showAllCategories", showAllCategories);
// router.post("/getCategoryPageDetails", categoryPageDetails);

// // ********************************************************************************************************
// //                                      Rating and Review
// // ********************************************************************************************************
// router.post("/createRating", auth, isStudent, createRating);
// router.get("/getAverageRating", getAverageRating);
// router.get("/getReviews", getAllRatingReview);

module.exports = router;
