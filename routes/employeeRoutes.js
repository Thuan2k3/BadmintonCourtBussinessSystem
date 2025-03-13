const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllUsersController } = require("../controllers/employeeCtrl");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

module.exports = router;
