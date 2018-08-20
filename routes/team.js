var express         =   require("express")              ,
    router          =   express.Router()                ,
    
    models          =   require("../models")            ,
    Team            =   models.Team                     ,
    User            =   models.User                     ,
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
        res.render("team/my", {User : foundUser})
    })
    .catch(function(error){
        res.redirect(previousURL)
    })
})

router.get("/:team_id", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    Team.findOne({_id : req.params.team_id})
    .then(function(foundTeam){
        res.render("team/team", {Team: foundTeam})
    })
    .catch(function(error){
        res.redirect(previousURL)
    })
})

module.exports = router




