const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/usreDB", {useNewUrlParser: true, useUnifiedTopology: true});

exports.User = () => {

    const userSchema = {
        email : String,
        password : String
    }

    const User = mongoose.model("User", userSchema);

    return User;
}



