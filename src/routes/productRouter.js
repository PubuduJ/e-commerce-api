const express = require('express');
const router = express.Router();
const authenticationMiddleware = require("../middlewares/authenticationMiddleware");
const authorizationMiddleware = require("../middlewares/authorizationMiddleware");
const {createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadProductImage} = require("../controllers/productController");

router.route("/")
.post([authenticationMiddleware,authorizationMiddleware("admin", "owner")], createProduct)
.get(getAllProducts);

router.route("/upload-image")
.post([authenticationMiddleware,authorizationMiddleware("admin", "owner")], uploadProductImage);

router.route("/:id")
.get(getSingleProduct)
.patch([authenticationMiddleware,authorizationMiddleware("admin", "owner")], updateProduct)
.delete([authenticationMiddleware,authorizationMiddleware("admin", "owner")], deleteProduct);

module.exports = router;