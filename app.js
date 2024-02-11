const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


main()
.then(res => console.log("Connected to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));
app.engine("ejs",ejsMate);

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res)=>{
    res.send("Root is working");
})

app.use("/listings", require("./routes/listing.js"));

app.use("/listings", require("./routes/review.js"));


// Error Handling middleware
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Internal server error"} = err;
  // console.log(err);
  res.status(statusCode).render("listings/error.ejs",{statusCode,message});
})

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})