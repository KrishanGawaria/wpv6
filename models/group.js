var mongoose    =   require('mongoose') ,
    Post        =   require("./post")   ,
    User        =   require("./user")

var groupSchema = new mongoose.Schema({
    
    name : {
        type : String
    }, 
    
    posts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Post"
        }    
    ],
    
    users : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }    
    ]
    
})

var Group = mongoose.model("Group", groupSchema)

module.exports = Group