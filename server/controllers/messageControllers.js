const Message = require("../models/messageModel");

const createMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;
    const message = await Message.create({
      chatId,
      senderId,
      text,
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMessage, getMessages };
