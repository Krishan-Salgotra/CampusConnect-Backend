const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "name email branch year skills bio"
    );

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
};