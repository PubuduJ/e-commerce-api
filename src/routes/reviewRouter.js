const express = require('express');
const router = express.Router();
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const {createReview, getAllReviews, getSingleReview, updateReview, deleteReview} = require("../controllers/reviewController");

router.route("/")
.post(authenticationMiddleware, createReview)
.get(getAllReviews);

router.route("/:id")
.get(getSingleReview)
.patch(authenticationMiddleware, updateReview)
.delete(authenticationMiddleware, deleteReview);

module.exports = router;