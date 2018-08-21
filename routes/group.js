var express         =   require("express")              ,
    router          =   express.Router()                ,
    
    models          =   require("../models")            ,
    Group           =   models.Group                    ,
    User            =   models.User                     ,
    helperFunctions =   require("../helper_functions")  
    
    

router.get("/new", function(req, res){
    res.render("group/new")
})

router.post("/", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    var newGroup = {
        name : req.body.name
    }
    Group.create(newGroup)
    .then(function(createdGroup){
        User.findOne({_id : req.user._id})
        .then(function(foundUser){
            createdGroup.users.push(foundUser)
            createdGroup.save()
            foundUser.groups.push(createdGroup)
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
    User.findOne({_id : req.user._id}).populate("groups")
    .then(function(foundUser){
        res.render("group/my", {User : foundUser})
    })
    .catch(function(error){
        res.redirect(previousURL)
    })
})

router.get("/:group_id", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    Group.findOne({_id : req.params.group_id})
    .then(function(foundGroup){
        res.render("group/group", {Group: foundGroup})
    })
    .catch(function(error){
        res.redirect(previousURL)
    })
})

// Add members to a specific group
router.put("/:group_id/adduser", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    Group.findOne({_id : req.params.group_id})
    .then(function(foundGroup){
        User.findOne({username : req.body.username})
        .then(function(foundUser){
            foundUser.groups.push(foundGroup)
            foundUser.save()
            foundGroup.users.push(foundUser)
            foundGroup.save()
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

// Leave Group
router.put("/:group_id/leaveuser", function(req, res){
    var previousURL = helperFunctions.previousURL(req.headers.referer)
    Group.findOne({_id : req.params.group_id})
    .then(function(foundGroup){
        User.findOne({_id : req.user._id})
        .then(function(foundUser){
            // Removing the user from group
            var i = 0
            foundGroup.users.forEach(function(memberUser, index){
                if(memberUser._id.equals(foundUser._id)){
                    i = index
                }
            })
            foundGroup.users.splice(i, i+1)
            foundGroup.save()
            
            // Removing group from the user
            i=0
            foundUser.groups.forEach(function(memberGroup, index){
                if(memberGroup._id.equals(foundGroup._id)){
                    i = index
                }
            })
            foundUser.groups.splice(i, i+1)
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

module.exports = router




