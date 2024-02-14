const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const dotenv = require("dotenv").config();
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

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

const sessionOptions = {
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true
  }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // A middleware that initializes passport.
app.use(passport.session());  // A web application needs the ability to identify users as they browse from page to page. This series of requests and responses, each associated with the same user, is known as a session.
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // serialize user into the session
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/", (req,res)=>{
    res.send("Root is working");
})

app.use("/", require("./routes/user.js"));

app.use("/listings", require("./routes/listing.js"));

app.use("/listings/:id/reviews", require("./routes/review.js"));


// Error Handling middleware
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Internal server error"} = err;
  // console.log(err);
  res.status(statusCode).render("listings/error.ejs",{statusCode,message});
})

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})