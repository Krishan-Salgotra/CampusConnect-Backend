const Project = require("../models/Project");

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (
      project.createdBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Only owner can edit",
      });
    }

    project.title =
      req.body.title || project.title;

    project.description =
      req.body.description ||
      project.description;

    project.techStack =
      req.body.techStack ||
      project.techStack;

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

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
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("teamMembers", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (
      project.createdBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Only owner can delete",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeTeamMember = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (
      project.createdBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message: "Only owner can remove members",
      });
    }

    project.teamMembers =
      project.teamMembers.filter(
        (memberId) =>
          memberId.toString() !==
          req.params.memberId
      );

    await project.save();

    const updatedProject =
      await Project.findById(project._id)
        .populate("createdBy", "name email")
        .populate(
          "teamMembers",
          "name email"
        );

    res.status(200).json(
      updatedProject
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const leaveProject = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    project.teamMembers =
      project.teamMembers.filter(
        (memberId) =>
          memberId.toString() !==
          req.user.id
      );

    await project.save();

    res.status(200).json({
      message: "Left project successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  removeTeamMember,
  leaveProject,
};