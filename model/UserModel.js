let mongoose = require("mongoose");
let UserModel = mongoose.model("UserModel",{
    email:{
        required:true,
        type:String,
        trim:true,
        minLength:5
    }
});



module.exports = {UserModel};