var mongoose    =   require('mongoose') ,
    User        =   require('./user')

var commentSchema = new mongoose.Schema({
    
    body : {
        type : String
    },
    
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }, 
        username : {
            type: String
        }
    }
    
})

var Comment = mongoose.model("Comment", commentSchema)

module.exports = Comment