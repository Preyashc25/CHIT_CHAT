import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const loggedInUsers = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: loggedInUsers } });

    res.status(200).json(filteredUser);
  } catch (error) {
    console.log("Error while Getting all contacts");
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMessageByUserId = async (req, res, next) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text || !image) {
      return res.status(400).json({ message: "Text or image is required" });
    }
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send message to your self" });
    }
    const receiverExist = await User.exists({ _id: receiverId });
    if (!receiverExist) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server Error" });
  }
};

export const getChatPartner = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    console.log(loggedInUserId);

    //Find all the messages where the loggedIn user is either sender or receiver..
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });
    console.log(messages);
    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];
    console.log(chatPartnerIds);

    const chatPartner = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");
    console.log(chatPartner);
    res.status(200).json(chatPartner);
  } catch (error) {
    console.log("Error in getChatPartner Controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
