const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

main()
.then(res => console.log("Connected to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/", (req,res)=>{
    res.send("Root is wotking");
})

app.get("/testListing", async (req,res)=>{
    let sampleListing = new Listing({
      title : "My new Villa",
      description : "By the Beach of Goa",
      price : 1200,
      location : "Calangute, Goa",
      country : "India"
    })

    await sampleListing.save();
    console.log("Smaple saved");
    res.send("successful testing");
})

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})