const cloudinary = require("../../config/cloudinary");
const Artist = require("../../models/Artist");
const Playlist = require("../../models/Playlist");
const Song = require("../../models/Song");

const addNewSong = async (req, res) => {
  try {
    // const { songname, songtags, bgcolour } = req.body;
    // if (!songname || !songtags || !bgcolour) {
    //   return res.status(400).json({ message: "Please fill all the fields." });
    // }
    const { songname, songtags, artistname, bgcolour } = req.body;
    if (!songname || !songtags || !artistname || !bgcolour) {
      return res.status(400).json({ message: "Please fill all the fields." });
    }
    if (!req.files["song"] || !req.files["image"]) {
      return res
        .status(400)
        .json({ message: "Please upload a song and image." });
    }

    const artist = await Artist.findOne({ artistname });
    if (!artist) {
      return res.status(400).json({ message: "Artist not found." });
    }

    const songFile = req.files["song"][0];
    const imageFile = req.files["image"][0];

    const songNameWithoutExt = songFile.originalname.replace(/\.[^/.]+$/, "");
    const imageNameWithoutExt = imageFile.originalname.replace(/\.[^/.]+$/, "");

    const songFileName = `${Date.now()}-${songNameWithoutExt}`;
    const imageFileName = `${Date.now()}-${imageNameWithoutExt}`;

    const songResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "auto", public_id: `songs/${songFileName}` },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(songFile.buffer);
    });
    const imageResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", public_id: `images/${imageFileName}` },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(imageFile.buffer);
    });

    const newSong = new Song({
      songname,
      songtags,
      artistname: artist._id,
      songimage_url: imageResult.secure_url,
      songimage_publicId: imageResult.public_id,
      songfile_url: songResult.secure_url,
      songfile_publicId: songResult.public_id,
      songbgcolour: bgcolour,
    });
    await newSong.save();

    artist.composedsongs.push(newSong._id);
    await artist.save();

    res.status(201).json({
      message: "Song added successfully",
      newSong,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "error uploading files" });
  }
};

const updateSong = async (req, res) => {
  const songId = req.params.songId;
  const { songname, songtags, songbgcolour, artistname } = req.body;
  try {
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    if (songname && song.songname !== songname) {
      // const duplicate/////////////////
      song.songname = songname;
    }
    if (songtags) {
      song.songtags = songtags;
    }
    if (songbgcolour) {
      song.songbgcolour = songbgcolour;
    }

    if (artistname) {
      const artist = await Artist.findOne({ artistname });
      if (!artist) {
        return res.status(400).json({ message: "Artist not found." });
      }
      song.artistname = artist._id;
    }

    if (req.files && req.files["song"]) {
      const songFile = req.files["song"][0];
      const oldSong = song.songfile_publicId;

      const songResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "auto", public_id: oldSong },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(songFile.buffer);
      });
    }

    if (req.files && req.files["image"]) {
      const imageFile = req.files["image"][0];
      const oldImage = song.songimage_publicId;

      const imageResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", public_id: oldImage },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(imageFile.buffer);
      });
    }
    song.save();
    res.status(200).json({ message: "Song updated successfully", song });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating song" });
  }
};

const deleteSong = async (req, res) => {
  try {
    const songId = req.params.id;
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    const deletesong = await cloudinary.uploader.destroy(
      song.songfile_publicId
    );
    console.log("Cloudinary song deleted:", deletesong);
    const deleteimage = await cloudinary.uploader.destroy(
      song.songimage_publicId
    );
    console.log("Cloudinary image deleted:", deleteimage);

    await Song.findByIdAndDelete(songId);
    await Artist.updateOne(
      { _id: song.artistname },
      { $pull: { composedsongs: songId } }
    );
    await Playlist.updateMany({ songs: songId }, { $pull: { songs: songId } });

    res.status(200).json({ message: "song deleted successfully" });

    /*/////////////// delte song from artist and playlist also///////////*/
  } catch (error) {
    console.error("Error deleting artist:", error);
  }
};

const getAllSongs = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const songs = await Song.find()
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("artistname");
    if (!songs) {
      return res.status(404).json({ message: "No songs found" });
    }
    const totalSongs = await Song.countDocuments();
    res.status(200).json({
      songs,
      totalSongs,
      totalPages: Math.ceil(totalSongs / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching songs" });
    console.log(error);
  }
};

const getSongById = async (req, res) => {
  try {
    const songId = req.params.id;
    const song = await Song.findById(songId).populate("artistname");
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.status(200).json({ song });
  } catch (error) {
    res.status(500).json({ message: "Error fetching songs" });
    console.log(error);
  }
};

const searchSong = async (req, res) => {
  try {
    const { page = 1, limit = 5, query } = req.query;
    const songs = await Song.find({ songname: { $regex: query, $options: "i" } })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("artistname");
    if (!songs) {
      return res.status(404).json({ message: "No songs found" });
    }
    const totalSongs = await Song.countDocuments({
      songname: { $regex: query, $options: "i" },
    });
    res.status(200).json({
      songs,
      totalSongs,
      totalPages: Math.ceil(totalSongs / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error fetching songs" });
  }
};

module.exports = {
  addNewSong,
  updateSong,
  deleteSong,
  getAllSongs,
  getSongById,
  searchSong
};
