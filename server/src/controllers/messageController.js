const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Message = require("../models/message");
const Chat = require("../models/chat");

const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { content, chatId } = req.body;

    const loggedUserId = req.person.id;

    if (!content && !chatId) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid data passed into request" });
    }

    const newMessage = {
      content: content,
      chatId: chatId,
      senderId: loggedUserId,
    };

    const message = await Message.create(newMessage);

    await Chat.update(
      { createdAt: message.createdAt },
      { where: { id: chatId } }
    );

    const populatedMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: Chat,
          as: "msg",
          include: [
            {
              model: User,
              as: "chatsender",
              attributes: ["id", "fullName", "email", "photo"],
            },
            {
              model: User,
              as: "receive",
              attributes: ["id", "fullName", "email", "photo"],
            },
          ],
        },
        {
          model: User,
          as: "sender",
          attributes: {
            exclude: ["password", "fpToken", "updatedAt", "createdAt", "role"],
          },
        },
      ],
    });

    const messageSenderId = populatedMessage.msg.chatSenderId;

    if (loggedUserId !== messageSenderId) {
      populatedMessage.msg.personId = messageSenderId;
      populatedMessage.msg.chatSenderId = loggedUserId;
      await populatedMessage.save();
    }
    return res.status(200).json(populatedMessage);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).send(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { chatId: req.params.chatId },
      include: [
        {
          model: Chat,
          as: "msg",
          include: [
            {
              model: User,
              as: "chatsender",
              attributes: ["id", "fullName", "email", "photo"],
            },
            {
              model: User,
              as: "receive",
              attributes: ["id", "fullName", "email", "photo"],
            },
          ],
        },
        {
          model: User,
          as: "sender",
          attributes: {
            exclude: ["password", "fpToken", "updatedAt", "createdAt", "role"],
          },
        },
      ],
    });

    for (let i = 0; i < messages.length; i++) {
      const messageSenderId = messages[i].senderId;
      if (messages[i].msg.chatSenderId !== messageSenderId) {
        messages[i].msg.personId = messages[i].msg.chatSenderId;
        messages[i].msg.chatSenderId = messageSenderId;
        await messages[i].save();
      }
    }

    return res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).send(error.message);
  }
});

module.exports = { allMessages, sendMessage };