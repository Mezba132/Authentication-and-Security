const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const userSchema = require("../models/user").userSchema();


const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret : "once upon a time in dhaka",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

//const encrypt = require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/usreDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

userSchema.plugin(passLocalMongoose);
userSchema.plugin(findOrCreate);
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/secrets"
    },
    function(accessToken, refreshToken, profile, cb) {
        // console.log(profile);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/auth/google",
    passport.authenticate('google', { scope: ['profile'] })
);

app.get("/auth/google/secrets",
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect("/secrets");
    });

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {

    const user = new User({
        email : req.body.username,
        password : req.body.password
    })

    req.login(user, (err) => {
        if(!err)
        {
            passport.authenticate("local")(req, res, () => {
                // console.log(req.session);
                res.redirect("/secrets");
            });
        }
        else
        {
            console.log(err);
            res.redirect("/login");
        }
    })

});

app.get("/logout", (req, res) => {
    // req.logout();
    // res.redirect("/");
    req.session.destroy((err) => {
        if(!err)
        {
            res.redirect("/");
        }
        else
        {
            console.log(err);
        }
    })
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    User.register({username : req.body.username}, req.body.password, (err, user) => {
        if(!err)
        {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
        }
        else
        {
            console.log(err);
            res.redirect("/register");
        }
    })
});

app.get("/secrets", (req, res) => {
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else
    {
        res.redirect("/login");
    }
});

module.exports = app;