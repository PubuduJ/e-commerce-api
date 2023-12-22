const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Please provide review rating"]
    },
    title: {
        type: String,
        trim: true,
        maxlength: 100,
        required: [true, "Please provide review title"]
    },
    comment: {
        type: String,
        required: [true, "Please provide review text"]
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    }
}, { timestamps: true })

// Set a compound index.
// Only one review per product per user.
ReviewSchema.index({product:1, user:1}, {unique: true});

// static methods are used with schema.
ReviewSchema.statics.calculateAverageRating = async function(productId) {
    console.log(productId.toString());
}

ReviewSchema.post("save", async function() {
    await this.constructor.calculateAverageRating(this.product);

    // inorder to invoke this we have to use review.save() method.
    console.log("Post save hook called");
})

ReviewSchema.post("remove", async function() {
    // inorder to invoke this we have to use review.remove() method.
    console.log("Post remove hook called");
})

module.exports = mongoose.model("Review", ReviewSchema);