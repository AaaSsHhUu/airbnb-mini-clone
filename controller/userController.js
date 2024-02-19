const signUp =  (req,res)=>{
    res.render("users/signup.ejs");
}

const signUpInfo = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        // console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

const login = (req,res)=>{
    res.render("users/login.ejs");
}

const loginInfo = async (req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

const logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    })
    req.flash("success","You are logged out!");
    res.redirect("/listings");
}

module.exports = {signUp, signUpInfo, login, loginInfo, logout}