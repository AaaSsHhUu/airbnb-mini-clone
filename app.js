const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

main()
.then(res => console.log("Connected to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

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



app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})