const getSignUp = (req, res, next) => {
  res.send("This is Signup end point");
};

const authController = {
  getSignUp,
};

export default authController;
