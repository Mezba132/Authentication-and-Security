const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const User = require("../models/user").User();

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, (err, checkInfo) => {
        if(!err)
        {
            if(checkInfo.password === password)
            {
                console.log("Successfully Loged in");
                res.render("secrets");
            }
            else
            {
                console.log("Email and Password Dosen't Match");
            }
        }
        else
        {
            console.log(err);
        }
    })
})

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const userInfo = new User ({
        email : req.body.username,
        password :  req.body.password
    });
    userInfo.save((err) => {
        if(!err)
        {
            res.render("secrets");
        }
        else
        {
            console.log(err);
        }
    });
});

module.exports = app;