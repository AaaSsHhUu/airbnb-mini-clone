const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../utils/middleware");
const { signUp, signUpInfo, login, loginInfo, logout } = require("../controller/userController");



router.route("/signup")
    // Sign up route
    .get(signUp)
    // sign up info route
    .post(wrapAsync(signUpInfo))



router.route("/login")
    // Login routes
    .get(login)
    // Login info routes
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}), wrapAsync(loginInfo))


// logout route
router.get("/logout", logout)

module.exports = router;