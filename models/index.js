var mongoose    =   require("mongoose")  ,
    User        =   require("./user")   ,
    Team        =   require("./team")   ,
    Group       =   require("./group")  ,
    Post        =   require("./post")   ,
    Comment     =   require("./comment")
    
var models = {
    User    :   User,
    Team    :   Team,
    Group   :   Group,
    Post    :   Post,
    Comment :   Comment
}

mongoose.connect("mongodb://localhost/wpv1", { useNewUrlParser: true })
// mongoose.set('debug', true)
mongoose.Promise = Promise

module.exports = models