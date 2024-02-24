const Listing = require("../models/listing")

const index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

const newListing = (req, res) => {
    res.render("listings/new.ejs");
}

const newData = async (req, res, next) => {
    // let {title,description,image,price,location,country} = req.body; 
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New Listing Created!!!");
    res.redirect("/listings");
    next(err);
}

const showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate(
            {
                path :"reviews",
                populate : {
                    path : "author"
                }
            })
        .populate("owner");
    if(!listing){
        req.flash("error","Your requested listing does not exist");
        res.redirect('/listings');
    }else{
        res.render("listings/show.ejs", { listing });
    }
}

const editLsting = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Your requested listing does not exist");
        res.redirect("/listings");
    }
    else{
        res.render("listings/edit.ejs", { listing });
    }
}

const updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        listing.save();
    }
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}

const deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}

module.exports = {index, newListing, newData, showListing, editLsting, updateListing, deleteListing}