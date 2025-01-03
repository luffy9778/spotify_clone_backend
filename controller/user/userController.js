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
module.exports = { getUser };
