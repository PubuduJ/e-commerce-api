const express = require('express');
const router = express.Router();
const authorizationMiddleware = require("../middlewares/authorizationMiddleware");
const { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword } = require("../controllers/userController");

router.route("/").get(authorizationMiddleware("admin", "owner"), getAllUsers);

router.route("/show-me").get(showCurrentUser);
router.route("/:id").get(getSingleUser);

router.route("/update").post(updateUser);
router.route("/update-user-password").post(updateUserPassword);

module.exports = router;