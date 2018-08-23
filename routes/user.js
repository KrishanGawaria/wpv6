var express         =   require('express')  ,
    router          =   express.Router()    ,
    
    models          =   require("../models"),  
    User            =   models.User         ,
    helperFunctions =   require("../helper_functions")
    
router.get("/", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    User.findOne({_id : req.user._id}).populate("posts")
    .then(function(foundUser){
        res.render("user/index", {User: foundUser})
    })
    .catch(function(error){
        console.log("Error")
        res.redirect(previousURL)
    })
})


// Followers
router.get("/followers", function(req, res){
    
    User.findOne({_id : req.user._id}).populate("followers")
    .then(function(foundUser){
        res.render("user/followers", {User : foundUser})
    })
    .catch(function(error){
        console.log("Error")
        res.redirect("/user/"+req.user._id)
    })
})


// Followings
router.get("/followings", function(req, res){
    User.findOne({_id : req.user._id}).populate("followings")
    .then(function(foundUser){
        res.render("user/followings", {User : foundUser})
    })
    .catch(function(error){
        console.log("Error")
        res.redirect("/user/"+req.user._id)
    })
    
})



// Logic to Follow User
router.put("/follow/:follow_user_id", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
        
    User.findOne({_id : req.user._id})
    .then(function(foundUser){
        User.findOne({_id : req.params.follow_user_id})
        .then(function(followUser){
            followUser.followers.push(foundUser)    // Appending the current user into followers of :follow_user_id
            followUser.save()
            foundUser.followings.push(followUser)   // Appending the :follow_user_id into followings of current user
            foundUser.save()
            res.redirect(previousURL)
        })
        .catch(function(error){
            console.log("Error")
            res.redirect(previousURL)
        })
    })
    .catch(function(error){
        console.log("Error")
        res.redirect(previousURL)
    })
})


// Logic to Unfollow User
router.put('/unfollow/:unfollow_user_id', function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    
    User.findOne({_id : req.user._id})
    .then(function(foundUser){
        User.findOne({_id : req.params.unfollow_user_id})
        .then(function(unfollowUser){
            var i=-1
            foundUser.followings.forEach(function(followingUser, index){
                if(unfollowUser._id.equals(followingUser._id)){
                    i = index
                }
            })
            foundUser.followings.splice(i, i+1) // :unfollow_user_id(unfollowUser) is at index i, and deleting it from followings of current user(foundUser)
            foundUser.save()
            
            i= -1
            unfollowUser.followers.forEach(function(followerUser, index){
                if(foundUser._id.equals(followerUser._id)){
                    i = index
                }
            })
            unfollowUser.followers.splice(i, i+1) // current user(foundUser) is at index i, and deleting it from followers of :unfollow_user_id(unfollowUser) 
            unfollowUser.save()
            
            res.redirect(previousURL)
        })
        .catch(function(error){
            console.log("Error")
            res.redirect(previousURL)
        })
    })
    .catch(function(error){
        console.log("Error")
        res.redirect(previousURL)
    })
})




module.exports = router