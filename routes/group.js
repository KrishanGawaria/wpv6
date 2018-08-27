var express         =   require("express")              ,
    router          =   express.Router()                ,
    
    models          =   require("../models")            ,
    Group           =   models.Group                    ,
    User            =   models.User                     ,
    Post            =   models.Post                     ,
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
    var startDate = helperFunctions.startDate()
    Group.findOne({_id : req.params.group_id}).populate("users")
    .then(function(foundGroup){
        Post.find({groupId : req.params.group_id, created : {$gte : startDate}}).sort({created : -1}).limit(20)
        .then(function(SortedPosts){
            res.render("group/group", {Group: foundGroup, SortedPosts: SortedPosts})
        })
        .catch(function(error){
            
        })
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
            var i = -1
            foundGroup.users.forEach(function(memberUser, index){
                if(memberUser._id.equals(foundUser._id)){
                    i = index
                }
            })
            foundGroup.users.splice(i, i+1)
            foundGroup.save()
            
            // Removing group from the user
            i=-1
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




