const Catogery = require("../models/Catogery");
const Tag = require("../models/Catogery");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        message: "Please fill in all fields",
        success: false,
      });
    }
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);
    return res.status(200).json({
      message: "Tag created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
exports.getAllCatogries = async (req, res) => {
  try {
    const allTags = await Post.find({}, { name: true, description: true });
    res.status(200).json({
      message: "All tags retrieved successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
exports.categoryPageDetails = async (req, res) => {
  try {
    // get catogeryId
    const { catogeryId } = req.body;
    //get courses for specified catogery id
    const selectedCategory = await Catogery.findById(catogeryId)
      .populate("courses")
      .exec();
    //validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }
    //get courses for different catogeries
    const differentCategories = await Catogery.find({
      _id: { $ne: catogeryId },
    })
      .populate("course")
      .exec();
    //get top 10 selling courses

    //return res
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
