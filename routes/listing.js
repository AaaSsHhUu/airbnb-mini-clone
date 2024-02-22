const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, validateListing,isOwner} = require("../utils/middleware.js");
const { index, newData, newListing, showListing, editLsting, updateListing, deleteListing } = require("../controller/listingController.js");
const multer = require("multer");
const upload = multer({ dest : "upload" });


router.route("/")
    // Index Route
    .get(wrapAsync(index))
    // new data route
    // .post(isLoggedIn ,validateListing, wrapAsync(newData))
    .post(upload.single("listing[image]"),(req,res)=>{
        res.send(req.file);
    })
    

// Add new listing route
router.get("/new", isLoggedIn ,wrapAsync(newListing))

router.route("/:id")
    // Show Route
    .get( wrapAsync(showListing))
    // Update route
    .put(isLoggedIn,validateListing, wrapAsync(updateListing))
    // Delete route
    .delete(isLoggedIn,isOwner, wrapAsync(deleteListing))



// Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(editLsting))



module.exports = router;