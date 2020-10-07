const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/usreDB", {useNewUrlParser: true, useUnifiedTopology: true});

exports.User = () => {

    const userSchema = new mongoose.Schema ({
        email : String,
        password : String
    });

    userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

    const User = mongoose.model("User", userSchema);
    return User;
}



