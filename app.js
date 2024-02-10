const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./joiSchema.js");
const Review = require("./models/review.js");


main()
.then(res => console.log("Connected to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));
app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res)=>{
    res.send("Root is working");
})

const validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error);
  }
  else{
    next();
  } 
}

const validateReview = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error)
  }
  else{
    next();
  }
}

// Index Route
app.get("/listings", wrapAsync(async (req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings}); 
}))

// Add new listing route
app.get("/listings/new",wrapAsync((req,res)=>{
  res.render("listings/new.ejs");
}))

// new data route
app.post("/listings",validateListing,wrapAsync(
  async (req,res,next)=>{
    // let {title,description,image,price,location,country} = req.body; 
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  next(err);
  }
))


// Show Route
app.get("/listings/:id" , wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

// Edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

// Update route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}))

// Delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}))

// Review route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing.id}`);
}))

// Delete review
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))




// Error Handling middleware
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Internal server error"} = err;
  // console.log(err);
  res.status(statusCode).render("listings/error.ejs",{statusCode,message});
})

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})