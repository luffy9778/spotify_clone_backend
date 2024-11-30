const express = require("express");
const {
  addNewSong,
  updateSong,
  deleteSong,
  getAllSongs,
  getSongById,
} = require("../../controller/admin/songController");
const upload = require("../../middleware/multer");
const router = express.Router();

router.post(
  "/upload",
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  addNewSong
);
router.put(
  "/edit/:id",
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  updateSong
);
router.delete("/:id", deleteSong);
router.get("/", getAllSongs);
router.get("/:id", getSongById);

module.exports = router;
