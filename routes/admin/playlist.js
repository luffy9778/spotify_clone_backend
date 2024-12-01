const express = require("express");
const upload = require("../../middleware/multer");
const {
  createPlaylist,
  deletePlayList,
  getAllPlaylist,
  getPlaylistById,
} = require("../../controller/admin/playlistController");
const verifyJwt = require("../../middleware/verifyJwt");
const verifyRoles = require("../../middleware/verifyRoles");
const router = express.Router();

router.post(
  "/upload",
  verifyJwt,
  verifyRoles("Admin", "User"),
  upload.single("image"),
  createPlaylist
);
router.delete("/:id", verifyJwt, verifyRoles("Admin"), deletePlayList);
router.get("/", verifyJwt, verifyRoles("Admin", "User"), getAllPlaylist);
router.get("/:id", verifyJwt, verifyRoles("Admin", "User"), getPlaylistById);

module.exports = router;
