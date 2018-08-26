var express         =   require('express')              ,
    router          =   express.Router()                ,
    
    models          =   require('../models')            ,
    User            =   models.User                     ,
    Post            =   models.Post                     ,
    Team            =   models.Team                     ,
    helperFunctions =   require("../helper_functions")

// Creating a new post And append it to user    
router.post("/", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    var newPost = {
        body : req.body.body,
        authorId: req.user._id,
        authorUsername : req.user.username,
        authorName : req.user.name
    }
    Post.create(newPost)
    .then(function(createdPost){
        User.findOne({_id : req.user._id})
        .then(function(foundUser){
            foundUser.posts.push(createdPost)
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


// Display form to edit post
router.get('/:post_id/edit', function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    Post.findOne({_id : req.params.post_id})
    .then(function(foundPost){
        res.render("post/edit", {Post : foundPost})
    })
    .catch(function(error){
        console.log("Error")
        res.redirect(previousURL)
    })
})


// Logic to edit the post
router.put("/:post_id", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    var newPostData = {
        body : req.body.body
    }
    Post.findByIdAndUpdate(req.params.post_id, newPostData, {new : true})
    .then(function(updatedPost){
        res.redirect(previousURL)
    })
    .catch(function(error){
        console.log("Error")
        res.redirect(previousURL)
    })
})


// Logic to delete the post
router.delete("/:post_id", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    Post.findByIdAndDelete(req.params.post_id)
    .then(function(){
        res.redirect(previousURL)
    })
    .catch(function(error){
        console.log("Error")
        res.redirect(previousURL)
    })
})


// Logic to create Team Post
router.post("/team/:team_id", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    var newPost = {
        body : req.body.body,
        authorId: req.user._id,
        authorUsername : req.user.username,
        authorName : req.user.name,
    }
    
    Post.create(newPost)
    .then(function(createdPost){
        Team.findOne({_id : req.params.team_id})
        .then(function(foundTeam){
            // Assigning tead id to the post
            createdPost.teamId = foundTeam._id
            createdPost.save()
            foundTeam.posts.push(createdPost)
            foundTeam.save()
            res.redirect(previousURL)
        })
        .catch(function(error){
            console.log("Error")
            res.redirect(previousURL)
        })
    })
})

module.exports = router
    