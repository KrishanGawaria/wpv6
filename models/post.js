var mongoose    =   require('mongoose') ,
    User        =   require("./user")   ,
    Comment     =   require("./comment"),
    Team        =   require("./team")   ,
    Group       =   require("./group")

var postSchema = new mongoose.Schema({
    
    body : {
        type : String
    }, 
    
    created : {
        type: Date,
        default : Date.now
    },
    
    authorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
        
    authorUsername : {
        type : String
    },
        
    authorName : {
        type : String
    },
    
    teamId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Team"
    }, 
    
    groupId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Group"
    },
    
    
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }    
    ]
    
})

var Post = mongoose.model("Post", postSchema)

module.exports = Post