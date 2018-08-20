var express         =   require('express')              ,
    router          =   express.Router()                ,
    passport        =   require('passport')             ,
    
    models          =   require("../models")            ,
    User            =   models.User                     ,
    
    middleware      =   require('../middleware')        ,
    helperFunctions =   require("../helper_functions")
    
    
    
    
router.get('/', function(req, res){
    res.render("home")
})

router.get('/login', function(req, res){
    res.render("login")
})

router.post('/login', passport.authenticate("local", {
    successRedirect : '/secret',
    failureRedirect : '/login'
}), function(req, res){
    // put the successRedirect line above in comment
    // var previousURL = helperFunctions.previousURL(req.headers.referer)   // It will always be /login because it comes from login form.
    // console.log("PREVIOUS: "+previousURL)
    // res.redirect(previousURL)
})

router.get('/register', function(req, res){
    res.render("register")
})

router.post('/register', function(req, res){
    
    var newUser = new User({
        name    :   req.body.name,
        username:   req.body.username
    })
    
    User.register(newUser, req.body.password, function(error, registeredUser){
        if(error){
            req.flash("error", "There was problem in registering you. Try with a different username")
            res.redirect('/register')
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Your are successfully registered")
                res.redirect('/secret')
            })
        }
    })
    
})

router.get('/logout', function(req, res){
    req.logout()
    req.flash("success", "Your are Logged Out")
    res.redirect('/')
})

router.get('/secret', middleware.isLoggedIn, function(req, res){
    res.redirect('/user/'+req.user._id)
})

module.exports = router