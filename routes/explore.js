var express         =   require('express')              ,
    router          =   express.Router()                ,
    
    models          =   require('../models')            ,
    User            =   models.User                     ,
    Post            =   models.Post                     ,
    Team            =   models.Team                     ,
    helperFunctions =   require("../helper_functions")
    

// Explore (Display all users)
router.get("/", function(req, res){
    
    var previousURL = helperFunctions.previousURL(req.headers.referer)  
    // req.headers.referer contains the full path of previous url e.g. https://domain.com/users/1234
    // Now previousURL is : /users/1234
    
    User.find({}).
    then(function(foundUsers){
        res.render("explore/explore", {Users : foundUsers})
    })
    .catch(function(error){
        console.log("Error")
        res.redirect(previousURL)
    })
})

// Explore a Specific user
router.get("/:explore_user_id", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    Post.find({authorId : req.params.explore_user_id, groupId : null, teamId : null}).sort({created : -1})
    // We don't want posts of team or group
    .then(function(foundPosts){
        User.findOne({_id : req.params.explore_user_id})
        .then(function(foundUser){
            res.render("explore/index", {Posts : foundPosts, User : foundUser})
        })
        .catch(function(error){
            res.redirect(previousURL)  
        })
    })
    .catch(function(error){
        console.log("Error")
        res.redirect(previousURL)
    })
})

// Followers of a specific user
router.get("/:explore_user_id/followers", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    User.findOne({_id : req.params.explore_user_id}).populate("followers").populate("followings")
    .then(function(foundUser){
        res.render("explore/followers", {User: foundUser})
    })
    .catch(function(error){
        console.log("Error")
        res.redirect(previousURL)
    })
})


// Followings of a specific user
router.get("/:explore_user_id/followings", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    User.findOne({_id : req.params.explore_user_id}).populate("followers").populate("followings")
    .then(function(foundUser){
        res.render("explore/followings", {User: foundUser})
    })
    .catch(function(error){
        console.log("Error")
        res.redirect(previousURL)
    })
})


// Teams of a specific user
router.get("/:explore_user_id/teams", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    User.findOne({_id : req.params.explore_user_id}).populate("teams")
    .then(function(foundUser){
        res.render("explore/teams", {User: foundUser})
    })
    .catch(function(error){
        console.log("Error")
        res.redirect(previousURL)
    })
})

module.exports = router