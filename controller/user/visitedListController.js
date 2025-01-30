const Playlist = require("../../models/Playlist");

const dummyVisitedData = async (req, res) => {
  try {
    const visitedData = await Playlist.find().limit(7).populate('songs'); // Fetch 7 playlists
    res.status(200).json(visitedData);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { dummyVisitedData };
