const Song = require("../../models/Song");
const User = require("../../models/User");

const getUser = async (req, res) => {
  const username = req.username;
  if (!username) {
    return res.status(400).json({ message: " username is required" });
  }
  const user = await User.findOne({ username })
    .select("-password")
    .populate("artists")
    .populate("playlist")
    .populate({
      path: "likedSongs",
      populate: {
        path: "artistname",
        model: "Artist",
      },
    });
  if (!user) {
    return res.status(404).json({ message: "no user found" });
  }
  //   console.log(user);
  res.json(user);
};

//for socket.io
const updateOnlineStatus = async (userId, isOnline, socketId = null) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { isOnline, socketId },
      { new: true }
    );
    return updateUser;
  } catch (error) {
    console.log(" Error updating user status", error);
  }
};

const updateOnlineStatusBySocketId = async (socketId, isOnline) => {
  try {
    const user = await User.findOneAndUpdate(
      { socketId },
      { isOnline, $unset: { socketId: "" } },
      { new: true }
    );
    return user;
  } catch (error) {
    console.log(" Error updating user status by soket id", error);
  }
};

const getAllUsers = async () => {
  try {
    return await User.find({ roles: { $nin: ["Admin"] } });
  } catch (error) {
    console.log("Error fetching all users", error);
  }
};
module.exports = {
  getUser,
  updateOnlineStatus,
  updateOnlineStatusBySocketId,
  getAllUsers,
};
