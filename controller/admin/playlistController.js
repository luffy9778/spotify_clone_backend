const cloudinary = require("../../config/cloudinary");
const Playlist = require("../../models/Playlist");
const Song = require("../../models/Song");

const createPlaylist = async (req, res) => {
  const { palylistname, playlistbgcolour, playlisttags, songs } = req.body;

  if (!palylistname || !playlistbgcolour || !playlisttags || !songs) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  if (!req.file) {
    return res
      .status(400)
      .json({ error: "Please add an image to the playlist" });
  }
  try {
    const validSongs = await Song.find({ _id: { $in: songs } });
    if (validSongs.length !== songs.length) {
      return res.status(400).json({ error: "Invalid song IDs" });
    }

    const imageFile = req.file;
    const originalNameWithoutExt = imageFile.originalname.replace(
      /\.[^/.]+$/,
      ""
    );
    const imageFileName = `${Date.now()}-${originalNameWithoutExt}`;

    const imageResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", public_id: `playlist/${imageFileName}` },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        )
        .end(imageFile.buffer);
    });

    const newPlaylist = new Playlist({
      palylistname,
      playlistbgcolour,
      playlisttags,
      songs,
      playlistimage: imageResult.secure_url,
      playlistimage_publicId: imageResult.public_id,
    });
    await newPlaylist.save();

    res
      .status(200)
      .json({ message: "new playlist created successfully", newPlaylist });
  } catch (error) {
    console.log("Error creating playlist:");
    res
      .status(500)
      .json({ message: "Error uploading image or creating playlist." });
  }
};

const getAllPlaylist = async (_, res) => {
  try {
    const playlists = await Playlist.find();
    if (!playlists) {
      return res.status(404).json({ message: "No playlists found" });
    }
    res.status(200).json(playlists);
  } catch (err) {
    console.log("Error fetching playlists:", err);
    res.status(500).json({ message: "Error fetching playlists." });
  }
};

const getPlaylistById = async (req, res) => {
  try {
    const playlistId = req.params.id;
    if(!playlistId){
      return res.status(404).json({ message: "Playlist not found" });
    }
    const playlist = await Playlist.findById(playlistId).populate({
      path: 'songs',           
      populate: {
        path: 'artistname',    
        model: 'Artist' }    
      })
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
      }
      res.status(200).json(playlist);
      } catch (err) {
        console.log("Error fetching playlist:", err);
        res.status(500).json({ message: "Error fetching playlist." });
      }
    }

const deletePlayList = async (req, res) => {
  const { id } = req.params;
  try {
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    if (playlist.playlistimage) {
      const publicId = playlist.playlistimage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`playlist/${publicId}`, {
        resource_type: "image",
      });
    }

    await Playlist.findByIdAndDelete(id);
    res.status(200).json({ message: "playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:");
    res.status(500).json({ error: "Error deleting playlist" });
  }
};
module.exports = { createPlaylist, deletePlayList,getAllPlaylist,getPlaylistById };
