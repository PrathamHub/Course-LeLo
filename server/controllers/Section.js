const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;
    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    //create section
    const newSection = await Section.create({ sectionName });
    //update course with section ObjectId
    const updatedCourseDetails = await Course.findOneAndUpdate(
      { courseId },
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      {
        new: true,
      }
    );
    // Use Populate to replace section and subsection both in the updatedCourseDetail
    //return res
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Unable to create section, Please try again",
      error: error,
    });
  }
};

exports.updateSection = async (req, res) => {
  const { SectionName, sectionId } = req.body;
  if (!sectionName || !sectionId) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields",
    });
  }
  const updatedSection = await Section.findOneAndUpdate(
    { sectionId },
    { sectionName },
    { new: true }
  );
  return res.status(200).json({
    success: true,
    message: "Section Updated Successfully",
  });
};
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    await Section.findOneAndDelete(sectionId);
    return res.status(200).json({
      success: true,
      message: "Section Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
