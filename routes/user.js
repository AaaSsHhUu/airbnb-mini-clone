const express = require("express");
const router = express.Router({mergeParams : true});
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../utils/middleware");
const { signUp, signUpInfo, login, loginInfo, logout } = require("../controller/userController");


// Sign up route
router.get("/signup",signUp)

// sign up info route
router.post("/signup", wrapAsync(signUpInfo))

// Login routes
router.get("/login", login)

// Login info routes
router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}), wrapAsync(loginInfo))

// logout route
router.get("/logout", logout)

module.exports = router;