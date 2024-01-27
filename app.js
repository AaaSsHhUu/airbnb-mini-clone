const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");


main()
.then(res => console.log("Connected to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));

app.use(express.urlencoded({extended : true}));

app.get("/", (req,res)=>{
    res.send("Root is wotking");
})

// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//       title : "My new Villa",
//       description : "By the Beach of Goa",
//       price : 1200,
//       location : "Calangute, Goa",
//       country : "India"
//     })

//     await sampleListing.save();
//     console.log("Smaple saved");
//     res.send("successful testing");
// })

// Index Route
app.get("/listings", async (req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings}); 
})

// Add new route
app.get("/listnings/new",(req,res)=>{
  res.render("listings/new.ejs");
})

// new data route
app.post("/listings", async (req,res)=>{
  // let {title,description,image,price,location,country} = req.body; 
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
})

// Show Route
app.get("/listings/:id" , async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

// Edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

// Update route
app.put("/listings/:id",async (req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect("/listings");
})

// Delete route
app.delete("/listings/:id",async (req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
})

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})