const express = require("express");
const {
  addNewSong,
  updateSong,
  deleteSong,
  getAllSongs,
  getSongById,
  searchSong,
} = require("../../controller/admin/songController");
const upload = require("../../middleware/multer");
const verifyJwt = require("../../middleware/verifyJwt");
const verifyRoles = require("../../middleware/verifyRoles");
const router = express.Router();

router.post(
  "/upload",
  verifyJwt,
  verifyRoles("Admin"),
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  addNewSong
);
router.put(
  "/edit/:id",
  verifyJwt,
  verifyRoles("Admin"),
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  updateSong
);
router.delete("/:id", verifyJwt, verifyRoles("Admin"), deleteSong);
router.get("/", verifyJwt, verifyRoles("Admin", "User"), getAllSongs); 
router.get("/search", searchSong); 
router.get("/:id", verifyJwt, verifyRoles("Admin", "User"), getSongById);

module.exports = router;
