var mongoose                =   require("mongoose")                 ,
    passportLocalMongoose   =   require("passport-local-mongoose")  ,

    Team                    =   require("./team")                   ,
    Group                   =   require("./group")                  ,
    Post                    =   require("./post")   

var userSchema = new mongoose.Schema({
    
    name : {
        type : String
    },
    
    username : {
        type : String
    },
    
    password : {
        type : String
    },
    
    team : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Team"
        }, 
        name : String
    }, 
    
    groups : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Group"
        }    
    ], 
    
    posts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Post"
        }    
    ],
    
    followers : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }    
    ],
    
    followings : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }    
    ], 
    
    noOfFollowers : {
        type : Number,
        default : 0
    },
    
    noOfFollowings : {
        type : Number,
        default : 0
    }
    
})

userSchema.plugin(passportLocalMongoose)

var User = mongoose.model("User", userSchema)

module.exports = User