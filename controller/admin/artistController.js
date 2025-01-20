const Artist = require("../../models/Artist");
const cloudinary = require("../../config/cloudinary");
const Song = require("../../models/Song");
const { model } = require("mongoose");

const createArtist = async (req, res) => {
  const { artistname, artistbgcolour } = req.body;

  if (!artistname || !artistbgcolour) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  if (!req.file) {
    return res.status(400).json({ error: "Please add an image " });
  }

  try {
    const duplicate = await Artist.findOne({ artistname });
    if (duplicate) {
      return res.status(400).json({ message: "Artist name already exists" });
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
          { resource_type: "image", public_id: `artist/${imageFileName}` },
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

    const newArtist = new Artist({
      artistname,
      artistimage_Url: imageResult.secure_url,
      artistimage_publicId: imageResult.public_id,
      artistbgcolour,
    });
    await newArtist.save();
    res.status(201).json({ message: "Artist created successfully" });
  } catch (error) {
    console.log("Error creating playlist:", error);
    res
      .status(500)
      .json({ message: "Error uploading image or creating playlist." });
  }
};

const updateArtist = async (req, res) => {
  try {
    const artistId = req.params.id;
    const { artistname, artistbgcolour } = req.body;

    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    if (artistname && artist.artistname !== artistname) {
      const existingArtist = await Artist.findOne({ artistname });
      if (existingArtist) {
        return res.status(400).json({ message: "Artist name already exists" });
      }
      artist.artistname = artistname;
    }

    if (artistbgcolour && artist.artistbgcolour !== artistbgcolour) {
      artist.artistbgcolour = artistbgcolour;
    }

    if (req.file) {
      const imageFile = req.file;
      const oldImage = artist.artistimage_publicId;
      const imageResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", public_id: oldImage },
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
      artist.artistimage_Url= imageResult.secure_url;
    }

    artist.save();
    res.status(200).json({ message: "updated", artist });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error uploading image or update playlist." });
  }
};

const getallArtist = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const artists = await Artist.find()
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("composedsongs");
    if (!artists) {
      return res.status(404).json({ message: "No artists found" });
    }
    const totalArtists = await Artist.countDocuments();

    res.status(200).json({
      artists,
      totalArtists,
      totalPages: Math.ceil(totalArtists / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching artists:", error);
    res.status(500).json({ message: "Error fetching artists" });
  }
};

const getArtistById = async (req, res) => {
  try {
    const artistId = req.params.id;
    const artist = await Artist.findById(artistId).populate({
      path: "composedsongs",
      populate: {
        path: "artistname",
        model: "Artist",
      },
    });
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.status(200).json({ artist });
  } catch (error) {
    console.error("Error fetching artist by ID:", error);
    res.status(500).json({ message: "Error fetching artist by ID" });
  }
};

const deleteArtist = async (req, res) => {
  try {
    const artistId = req.params.id;
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    /*/////////////////--------------------------------///////////////////*/

    if (artist.composedsongs.length) {
      return res
        .status(400)
        .json({ message: "Artist has songs, cannot delete" });
    }
    const deleteResult = await cloudinary.uploader.destroy(
      artist.artistimage_publicId
    );
    console.log("Cloudinary image deleted:", deleteResult);

    await Artist.findByIdAndDelete(artistId);
    // await Song.updateMany(
    //   {artistname:artist._id},
    //   {$pull:{}}
    // )
    res.status(200).json({ message: "Artist deleted successfully" });
  } catch (error) {
    console.error("Error deleting artist:", error);
    res.status(500).json({ message: "Error deleting artist" });
  }
};

const searchArtist = async (req, res) => {
  try {
    const { page = 1, limit = 5, query } = req.query;
    const artist = await Artist.find({
      artistname: { $regex: query, $options: "i" },
    })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    if (!artist) {
      return res.status(404).json({ message: "No artist found" });
    }
    const totalArtist = await Artist.countDocuments({
      artistname: { $regex: query, $options: "i" },
    });
    res.status(200).json({
      artists: artist,
      totalArtist,
      totalPages: Math.ceil(totalArtist / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching artist" });
  }
};

module.exports = {
  createArtist,
  updateArtist,
  getallArtist,
  getArtistById,
  deleteArtist,
  searchArtist,
};
