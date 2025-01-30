const express = require("express");
const verifyJwt = require("../../middleware/verifyJwt");
const verifyRoles = require("../../middleware/verifyRoles");
const {
  dummyVisitedData,
} = require("../../controller/user/visitedListController");
const router = express.Router();

router.get("/", verifyJwt, verifyRoles("User"), dummyVisitedData);

module.exports = router;
