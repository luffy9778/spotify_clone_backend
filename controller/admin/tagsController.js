const cloudinary = require("../../config/cloudinary");
const Tags = require("../../models/Tags");

const addSerchTags = async (req, res) => {
  const { tagName, tagColour } = req.body;
  if (!tagName || !tagColour) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }
  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image." });
  }
  try {
    const duplicate = await Tags.findOne({ tagName });
    if (duplicate) {
      return res.status(400).json({ message: "Tag already exists." });
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
          { resource_type: "image", public_id: `tags/${imageFileName}` },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(imageFile.buffer);
    });

    const newTag = new Tags({
      tagName,
      tagBgcolour: tagColour,
      tagImage_url: imageResult.secure_url,
      tagImage_publicId: imageResult.public_id,
    });
    await newTag.save();
    res.status(201).json({ message: "Tag created successfully.", newTag });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllTags = async (_, res) => {
  try {
    const tags = await Tags.find();
    res.status(200).json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addSerchTags,getAllTags};
