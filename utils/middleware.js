const Listing = require("../models/listing");
const ExpressError = require('./ExpressError');
const listingSchema = require("../joiSchema");
const {reviewSchema} = require("../joiSchema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create a listing");
        res.redirect("/login");
    }
    next();
}

// as on successful login, passport resets the session therefore redirectUrl will come undefined, so we have to save it in locals.
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
      throw new ExpressError(400,error);
    }
    else{
      next();
    } 
  }

  module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error)
    }
    else {
        next();
    }
}
