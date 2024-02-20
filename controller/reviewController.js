const Listing = require("../models/listing")
const Review = require("../models/review")

const addReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Review posted");

    res.redirect(`/listings/${listing.id}`);
}

const deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review removed");
    res.redirect(`/listings/${id}`);
}

module.exports = {addReview, deleteReview}