const express = require("express");
const upload = require("../../middleware/multer");
const {
  createArtist,
  updateArtist,
  getallArtist,
  getArtistById,
  deleteArtist,
  searchArtist,
} = require("../../controller/admin/artistController");
const verifyRoles = require("../../middleware/verifyRoles");
const verifyJwt = require("../../middleware/verifyJwt");
const router = express.Router();

router.post("/add",verifyJwt,verifyRoles("Admin"), upload.single("image"), createArtist);
router.put(
  "/edit/:id",
  verifyJwt,
  verifyRoles("Admin"),
  upload.single("image"),
  updateArtist
);
router.get("/", verifyJwt, verifyRoles("Admin"), getallArtist);
router.get("/search", verifyJwt, verifyRoles("Admin"), searchArtist);
router.get("/:id", verifyJwt, verifyRoles("Admin","User"), getArtistById);
router.delete("/:id", deleteArtist);

module.exports = router;
