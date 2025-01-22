const Artist = require("../../models/Artist");
const User = require("../../models/User");

const follwArtist = async (req, res) => {
  try {
    const username = req.username;
    const artistId = req.body.artistId;
    if (!username || !artistId) {
      return res
        .status(400)
        .json({ message: "username and artistId are required" });
    }
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: "no artist found" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }
    if (user.artists.includes(artistId)) {
      return res.status(400).json({ message: "artist already followed" });
    }
    user.artists.push(artistId);
    await user.save();
    return res.status(200).json({ message: "artist added" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const unfollowArtist = async (req, res) => {
  try {
    const username = req.username;
    const artistId = req.params.artistId;
    if (!username || !artistId) {
      return res
        .status(400)
        .json({ message: "username and artistId are required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }
    if (!user.artists.includes(artistId)) {
      return res.status(400).json({ message: "artist not followed" });
    }
    user.artists.pull(artistId);
    await user.save();
    return res.status(200).json({ message: "artist removed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { follwArtist,unfollowArtist };
