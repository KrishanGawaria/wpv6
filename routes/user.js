var express         =   require('express')  ,
    router          =   express.Router()    ,
    
    models          =   require("../models"),  
    User            =   models.User         ,
    Post            =   models.Post         ,
    helperFunctions =   require("../helper_functions")
    
router.get("/", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    
    var AllPosts = []
    var startDate = helperFunctions.startDate() // contains the date 2 days before
    
    Post.find({authorId : req.user._id, teamId: null, groupId: null, created: {$gte : startDate}}).sort({created : -1}).limit(10)
    // above line finds at most 10 posts with given authorId and which were created before 2 days or after; and exclude 
        //      the posts of teams and groups. created: -1 means to sort the posts by descending order of created.
        //      To sort by ascending order, make the created value to be 1. 
        //      $gte : startDate means greater than startDate
    .then(function(foundPosts){
        foundPosts.forEach(function(foundPost){
            AllPosts.push(foundPost)
        })
        User.findOne({_id : req.user._id}).populate("followings")
        .then(function(foundUser){
            
            foundUser.followings.forEach(function(followingUser, index){
                Post.find({authorId : followingUser._id, teamId: null, groupId: null, created : {$gte: startDate}}).sort({created : -1}).limit(10)
                .then(function(foundPosts){
                    foundPosts.forEach(function(foundPost){
                        AllPosts.push(foundPost)
                    })
                    if((index+1) == foundUser.followings.length){
                        // Sorting the AllPosts array by date
                        AllPosts = helperFunctions.sortPostsByDate(AllPosts)
                        res.render("user/index", {Posts: AllPosts})
                    }
                })
                .catch(function(error){
                    res.redirect(previousURL)
                })
            })

        })
        .catch(function(error){
            res.redirect(previousURL)
        })
        
    })
    .catch(function(error){
        console.log(error)
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