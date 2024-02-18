const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, validateListing,isOwner} = require("../utils/middleware.js");


// Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}))

// Add new listing route
router.get("/new", isLoggedIn ,wrapAsync((req, res) => {
    res.render("listings/new.ejs");
}))

// new data route
router.post("/",isLoggedIn ,validateListing, wrapAsync(
    async (req, res, next) => {
        // let {title,description,image,price,location,country} = req.body; 
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success","New Listing Created!!!");
        res.redirect("/listings");
        next(err);
    }
))


// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Your requested listing does not exist");
        res.redirect('/listings');
    }else{
        res.render("listings/show.ejs", { listing });
    }
}))

// Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Your requested listing does not exist");
        res.redirect("/listings");
    }
    else{
        res.render("listings/edit.ejs", { listing });
    }
}))

// Update route
router.put("/:id",isLoggedIn,validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}))

// Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}))



module.exports = router;