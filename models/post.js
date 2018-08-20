var mongoose    =   require('mongoose') ,
    User        =   require("./user")   ,
    Comment     =   require("./comment")

var postSchema = new mongoose.Schema({
    
    body : {
        type : String
    }, 
    
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        
        username : {
            type : String
        }
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