const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, validateListing,isOwner} = require("../utils/middleware.js");
const { index, newData, newListing, showListing, editLsting, updateListing, deleteListing } = require("../controller/listingController.js");


// Index Route
router.get("/", wrapAsync(index))

// Add new listing route
router.get("/new", isLoggedIn ,wrapAsync(newListing))

// new data route
router.post("/",isLoggedIn ,validateListing, wrapAsync(newData))


// Show Route
router.get("/:id", wrapAsync(showListing))

// Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(editLsting))

// Update route
router.put("/:id",isLoggedIn,validateListing, wrapAsync(updateListing))

// Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(deleteListing))



module.exports = router;