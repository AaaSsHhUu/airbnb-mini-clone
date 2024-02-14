const express = require("express");
const { route } = require("./listing");
const router = express.Router({mergeParams : true});
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


// Signup routes

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","user registered successfully");
        res.redirect("/listings");
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}))

// Login routes
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login", passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}), wrapAsync(async (req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    res.redirect("/listings");
}))

module.exports = router;