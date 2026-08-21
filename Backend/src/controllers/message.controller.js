const sendMessage = (req, res, next) => {
  res.send("Message Endpoint");
};

const msgController = {
  sendMessage,
};
export default msgController;
