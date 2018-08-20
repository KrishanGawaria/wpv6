var mongoose    =   require('mongoose') ,
    Post        =   require("./post")   ,
    User        =   require("./user")

var teamSchema = new mongoose.Schema({
    
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

var Team = mongoose.model("Team", teamSchema)

module.exports = Team