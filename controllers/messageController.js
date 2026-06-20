const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  try {
    const { projectId, text } = req.body;

    const message = await Message.create({
      projectId,
      text,
      sender: req.user.id,
    });

    const populatedMessage =
      await Message.findById(message._id)
        .populate("sender", "name");

    const io = req.app.get("io");

    io.to(projectId).emit(
      "newMessage",
      populatedMessage
    );

    res.status(201).json(
      populatedMessage
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMessages = async (
  req,
  res
) => {
  try {
    const messages =
      await Message.find({
        projectId:
          req.params.projectId,
      })
        .populate(
          "sender",
          "name"
        )
        .sort({
          createdAt: 1,
        });

    res.status(200).json(
      messages
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};