var express                 =   require('express')                  ,
    app                     =   express()                           ,
    bodyParser              =   require('body-parser')              ,
    passport                =   require('passport')                 ,
    localStrategy           =   require("passport-local")           ,
    passportLocalMongoose   =   require('passport-local-mongoose')  ,
    expressSession          =   require('express-session')          ,
    flash                   =   require('connect-flash')            ,
    methodOverride          =   require("method-override")          ,
    
    models                  =   require('./models')                 ,
    User                    =   models.User                         ,
    
    indexRoutes             =   require('./routes/index')           ,
    userRoutes              =   require('./routes/user')            ,
    teamRoutes              =   require("./routes/team")
    
    

app.use(flash())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.set("view engine", "ejs")

app.use(expressSession({
    secret              :   'Not to Guess',
    resave              :   false,
    saveUninitialized   :   false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
    res.locals.currentUser  = req.user,
    res.locals.error        = req.flash("error"),
    res.locals.success      = req.flash("success")
    next()
})


app.use('/', indexRoutes)
app.use('/user/:user_id', userRoutes)
app.use('/user/:user_id/teams', teamRoutes)

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started ...")
})
