const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      branch,
      year,
      skills,
      bio,
      github,
      linkedin,
      portfolio,
    } = req.body;

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.branch =
      branch ?? user.branch;

    user.year =
      year ?? user.year;

    user.skills =
      skills ?? user.skills;

    user.bio =
      bio ?? user.bio;

    user.github =
      github ?? user.github;

    user.linkedin =
      linkedin ?? user.linkedin;

    user.portfolio =
      portfolio ?? user.portfolio;

    await user.save();

    res.status(200).json({
      message:
        "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const uploadProfileImage = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.profileImage =
      "/uploads/" + req.file.filename;

    await user.save();

    res.status(200).json({
      message:
        "Profile image uploaded successfully",
      image: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllStudents = async (
  req,
  res
) => {
  try {
    const students = await User.find().select(
      "-password"
    );

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getAllStudents,
};