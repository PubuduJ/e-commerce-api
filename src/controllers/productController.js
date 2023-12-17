const { StatusCodes } = require('http-status-codes');
const Product = require("../models/Product");
const CustomError = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const createProduct = async (req, res) => {
    // attach logged in user id to the user property in Product document.
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product });
}

const getAllProducts = async (req, res) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({ products, count: products.length });
}

const getSingleProduct = async (req, res) => {
    const {id: productId} = req.params;
    
    const product = await Product.findOne({_id: productId});

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }
    res.status(StatusCodes.OK).json({ product })
}

const updateProduct = async (req, res) => {
    const {id: productId} = req.params;

    const product = await Product.findOneAndUpdate({_id: productId}, req.body, {new: true, runValidators: true});
    
    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }
    res.status(StatusCodes.OK).json({ product })
}

const deleteProduct = async (req, res) => {
    const {id: productId} = req.params;

    const product = await Product.findByIdAndDelete({_id:productId});

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }
    return res.status(StatusCodes.OK).json({ message: `Product with id ${productId} is deleted successfully` });
}

const uploadProductImage = async (req, res) => {
    // Check if file exists.
    if (!req.files) {
        throw new CustomError.BadRequestError("No file uploaded");
    }
    const productImage = req.files.image;
    // Check the format.
    if (!productImage.mimetype.startsWith("image")) {
        throw new CustomError.BadRequestError("Please upload an image");
    }
    // Check the size of the image ( < 1MB).
    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) {
        throw new CustomError.BadRequestError("Please upload an image smaller than 1MB");
    }
    // upload the image to cloudinary and get the secure url.
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename: true,
        folder: "file-upload"
    })
    // once upload file to the cloudinary, remove the file from tmp directory.
    fs.unlinkSync(req.files.image.tempFilePath);
    return res.status(StatusCodes.OK).json({imageURL: result.secure_url});
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage
};