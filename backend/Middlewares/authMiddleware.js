import User from "../Models/User.js";

export const protect = async (req, res, next) => {
  const auth = req.auth;
  const userId = auth.userId;
  console.log(userId)

  if (!userId) {
    res.json({ success: false, message: "not authenticated" });
  } else {
    const user = await User.findById(userId);
    req.user = user;
    next();
  }
};
