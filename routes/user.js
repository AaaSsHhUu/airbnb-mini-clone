const express = require("express");
const { route } = require("./listing");
const router = express.Router({mergeParams : true});
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");

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

module.exports = router;