const express = require("express");
const { getTotalCounts } = require("../../controller/admin/getDbInfo");
const router = express.Router();
router.get("/",getTotalCounts)
module.exports = router;