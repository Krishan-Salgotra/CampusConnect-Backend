const Request = require("../models/Request");
const Project = require("../models/Project");
const Notification = require(
  "../models/Notification"
);

const sendRequest = async (req, res) => {
  try {
    const { projectId } = req.body;

    const project = await Project.findById(
      projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const existingRequest =
      await Request.findOne({
        projectId,
        senderId: req.user.id,
      });

    if (existingRequest) {
      return res.status(400).json({
        message:
          "Request already sent",
      });
    }

    const request =
      await Request.create({
        projectId,
        senderId: req.user.id,
        receiverId:
          project.createdBy,
      });

    await Notification.create({
      userId: project.createdBy,
      message:
        "You received a new join request.",
    });

    res.status(201).json({
      message:
        "Request sent successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      receiverId: req.user.id,
    })
      .populate("senderId", "name email")
      .populate("projectId", "title");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateRequestStatus = async (
  req,
  res
) => {
  try {
    const { requestId } =
      req.params;

    const { status } =
      req.body;

    const request =
      await Request.findById(
        requestId
      );

    if (!request) {
      return res.status(404).json({
        message:
          "Request not found",
      });
    }

    request.status = status;

    await request.save();

    if (status === "accepted") {
      await Notification.create({
        userId:
          request.senderId,
        message:
          "Your join request was accepted.",
      });
    }

    if (status === "rejected") {
      await Notification.create({
        userId:
          request.senderId,
        message:
          "Your join request was rejected.",
      });
    }

    res.status(200).json({
      message:
        "Request updated successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendRequest,
  getMyRequests,
  updateRequestStatus,
};