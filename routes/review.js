const express = require("express");
const router = express.Router({mergeParams : true}); // mergerParams preserves the req.params value from parent url
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../utils/middleware.js");



// Review route
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Review posted");

    res.redirect(`/listings/${listing.id}`);
}))

// Delete review
router.delete("/:reviewId",isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review removed");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;

