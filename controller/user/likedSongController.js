const Song = require("../../models/Song");
const User = require("../../models/User");

const getLikedsong = async (req, res) => {
  const username = req.username;
  if (!username) {
    return res.status(400).json({ message: " username is required" });
  }
  const user = await User.findOne({ username }).populate("likedSongs");
  if (!user) {
    return res.status(404).json({ message: "no user found" });
  }
  console.log(user);
  res.json(user.likedSongs);
  // const likedSongs=user.likedSongs
};

const addLikedSongs = async (req, res) => {
  const username = req.username;
  const songId = req.body.songId;
  if (!username || !songId) {
    return res
      .status(400)
      .json({ message: "username and songId are required" });
  }
  const song = await Song.findById(songId);
  if (!song) {
    return res.status(404).json({ message: "no song found" });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "no user found" });
  }
  try {
    const result = await User.updateOne(
      { username },
      { $addToSet: { likedSongs: songId } }
    );

    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: "song added to liked songs" });
    } else {
      return res.status(400).json({ message: "song already in liked songs" });
    }
  } catch (error) {
    console.error("Error adding song to liked songs:");
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeLikedSongs = async (req, res) => {
  const username = req.username;
  const songId = req.body.songId;
  if (!songId) {
    return res.status(400).json({ message: "songId is required" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }
    if (!user.likedSongs.includes(songId)) {
      return res.status(400).json({ message: "song not found in liked songs" });
    }

    const result = await User.updateOne(
      { username },
      { $pull: { likedSongs: songId } }
    );
    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: "Song removed from liked songs" });
    } else {
      return res.status(400).json({ message: "Failed to remove song" });
    }
  } catch (error) {
    console.error("Error removing song from liked songs");
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getLikedsong, addLikedSongs,removeLikedSongs };
