const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllUsersController } = require("../controllers/staffCtrl");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//POST METHOD || PRODUCT
// router.post("/add-product", authMiddleware, addProductController);


module.exports = router;
