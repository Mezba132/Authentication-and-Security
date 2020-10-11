const mongoose = require("mongoose");

exports.userSchema = () => {

    const userSchema = new mongoose.Schema ({
        email : String,
        password : String,
        googleId : String,
        facebookId : String
    });

    return userSchema;

};



