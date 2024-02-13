const express = require("express");
const router = express.Router({mergeParams : true}); // mergerParams preserves the req.params value from parent url
const {reviewSchema} = require("../joiSchema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");


const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error)
    }
    else {
        next();
    }
}

// Review route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Review posted");

    res.redirect(`/listings/${listing.id}`);
}))

// Delete review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review removed");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;

