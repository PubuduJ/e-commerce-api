const { StatusCodes } = require('http-status-codes');
const Review = require("../models/Review");
const Product = require("../models/Product");
const CustomError = require("../errors");
const {checkPermission} = require("../utils");

const createReview = async (req, res) => {
    const {product: productId} = req.body;

    const isValidProduct = await Product.findOne({_id: productId});
    if (!isValidProduct) {
        throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }

    const alreadySubmitted = await Review.findOne({product: productId, user: req.user.userId})
    if (alreadySubmitted) {
        throw new CustomError.BadRequestError("Already submitted review for this product");
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({review});
}

const getAllReviews = async (req, res) => {
    // Populate method can be used to get data from other collections whitch has reference to the current collection.
    const reviews = await Review.find({})
    .populate({
        // current document field name.
        path: "product",
        // product document fields.
        select: "name company price"
    })
    .populate({
        // current document field name.
        path: "user",
        // user document fields.
        select: "name role"
    });
    res.status(StatusCodes.OK).json({reviews, count: reviews.length});
}

const getSingleReview = async (req, res) => {
    const {id: reviewId} = req.params;
    const review = await Review.findOne({_id: reviewId})
    .populate({
        // current document field name.
        path: "product",
        // product document fields.
        select: "name company price"
    })
    .populate({
        // current document field name.
        path: "user",
        // user document fields.
        select: "name role"
    });

    if (!review) {
        throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
    }
    res.status(StatusCodes.OK).json({review});
}

const updateReview = async (req, res) => {
    const {id: reviewId} = req.params;

    let review = await Review.findOne({_id: reviewId});
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
    }
    checkPermission(req.user, review.user);
    review = await Review.findOneAndUpdate({_id: reviewId}, req.body, {new: true, runValidators: true});
    res.status(StatusCodes.OK).json({ review });
}

const deleteReview = async (req, res) => {
    const {id: reviewId} = req.params;
    const review = await Review.findOne({_id: reviewId});

    if (!review) {
        throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
    }
    checkPermission(req.user, review.user);
    await Review.findByIdAndDelete({_id:reviewId});
    res.status(StatusCodes.OK).json({ message: `Review with id ${reviewId} is deleted successfully` });
}

const getSingleProductReviews = async (req, res) => {
    const {id: productId} = req.params;
    const reviews = await Review.find({product: productId});
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}