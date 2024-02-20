const express = require("express");
const router = express.Router({mergeParams : true}); // mergerParams preserves the req.params value from parent url
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../utils/middleware.js");
const { addReview, deleteReview } = require("../controller/reviewController.js");



// Add Review route
router.post("/",isLoggedIn, validateReview, wrapAsync(addReview))

// Delete review
router.delete("/:reviewId",isReviewAuthor, wrapAsync(deleteReview))

module.exports = router;

