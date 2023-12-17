const { StatusCodes } = require('http-status-codes');
const Product = require("../models/Product");
const CustomError = require("../errors");

const createProduct = async (req, res) => {
    // attach logged in user id to the user property in Product document.
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product });
}

const getAllProducts = async (req, res) => {
    res.send("get all products");
}

const getSingleProduct = async (req, res) => {
    res.send("get single product");
}

const updateProduct = async (req, res) => {
    res.send("update product");
}

const deleteProduct = async (req, res) => {
    res.send("delete product");
}

const uploadProductImage = async (req, res) => {
    res.send("upload product image");
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage
};