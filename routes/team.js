var express         =   require("express")              ,
    router          =   express.Router()                ,
    
    models          =   require("../models")            ,
    Team            =   models.Team                     ,
    User            =   models.User                     ,
    Post            =   models.Post                     ,
    helperFunctions =   require("../helper_functions")  
    
    
    
router.get("/", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    
    Team.find({})
    .then(function(foundTeams){
        res.render("team/teams", {Teams: foundTeams})
    })
    .catch(function(error){
        res.redirect(previousURL)
    })
})

router.get("/new", function(req, res){
    res.render("team/new")
})

router.post("/", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    var newTeam = {
        name : req.body.name
    }
    Team.create(newTeam)
    .then(function(createdTeam){
        User.findOne({_id : req.user._id})
        .then(function(foundUser){
            createdTeam.users.push(foundUser)
            createdTeam.save()
            foundUser.teams.push(createdTeam)
            foundUser.save()
            res.redirect(previousURL)  
        })
        .catch(function(error){
            res.redirect(previousURL)
        })
    })
    .catch(function(error){
        res.redirect(previousURL)
    })
})


router.get("/my", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)

    User.findOne({_id : req.user._id}).populate("teams")
    .then(function(foundUser){
        console.log("foundUser: "+foundUser)
        res.render("team/my", {User : foundUser})
    })
    .catch(function(error){
        res.redirect(previousURL)
    })
})

router.get("/:team_id", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    var startDate = helperFunctions.startDate()
    
    Team.findOne({_id : req.params.team_id}).populate("users")
    .then(function(foundTeam){
        Post.find({teamId : req.params.team_id, created : {$gte : startDate}}).sort({created : -1}).limit(20)
        //  The at most 20 posts which were created after (before 2 days) and sorted by descending oreder of created
        .then(function(SortedPosts){
            res.render("team/team", {Team: foundTeam, SortedPosts : SortedPosts})  
        })
        .catch(function(error){
            res.redirect(previousURL)
        })
    })
    .catch(function(error){
        res.redirect(previousURL)
    })
})

// Add members to a specific team
router.put("/:team_id/adduser", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    Team.findOne({_id : req.params.team_id})
    .then(function(foundTeam){
        User.findOne({username : req.body.username})
        .then(function(foundUser){
            foundUser.teams.push(foundTeam)
            foundUser.save()
            foundTeam.users.push(foundUser)
            foundTeam.save()
            res.redirect(previousURL)
        })
        .catch(function(error){
            res.redirect(previousURL)
        })
    })
    .catch(function(error){
        res.redirect(previousURL)
    })
})


// Leave Team
router.put("/:team_id/leaveuser", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    Team.findOne({_id : req.params.team_id})
    .then(function(foundTeam){
        User.findOne({_id : req.user._id})
        .then(function(foundUser){
            // Removing the user from team
            var i = -1
            foundTeam.users.forEach(function(memberUser, index){
                if(memberUser._id.equals(foundUser._id)){
                    i = index
                }
            })
            
            foundTeam.users.splice(i, i+1)
            foundTeam.save()
            
            // Removing team from the user
            i=-1
            foundUser.teams.forEach(function(memberTeam, index){
                if(memberTeam._id.equals(foundTeam._id)){
                    i = index
                }
            })
            foundUser.teams.splice(i, i+1)
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
module.exports = router




