const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const { title, description, techStack } = req.body;

    const project = await Project.create({
      title,
      description,
      techStack,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email")
      .populate("teamMembers", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
};