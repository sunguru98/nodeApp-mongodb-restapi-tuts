let mongoose = require("mongoose");
let validator = require("validator");
let jwt = require("jsonwebtoken");
let _ = require("lodash");
let bcrypt = require("bcryptjs");

let UserSchema = new mongoose.Schema({
    email:{
        required:true,
        type:String,
        trim:true,
        minLength:5,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:"{VALUE} is not a valid email",
        }
    },
    password:{
        type:String,
        minlength:8,
        required:true
    },
    tokens:[{
        access:{
            type:String,
            required:true,
        },
        token:{
            type:String,
            required:true,
        }
    }],
});
UserSchema.statics.findByToken = function(token){
    let currentUser = this;
    let decodedToken;
    try{
        decodedToken = jwt.verify(token,"SundeepCharan");
    }  
    catch(e){
        return Promise.reject();
    }
    return UserModel.findOne({

        "_id":decodedToken._id,
        "tokens.token":token,
        "tokens.access":"auth",    
    })
}

UserSchema.methods.generateAuthToken = function(){
    let currentUser = this; 
    let access = "auth";
    let tokenToBeConverted = {
        _id : currentUser._id.toHexString(),
        access
    }
    let token = jwt.sign(tokenToBeConverted,"SundeepCharan").toString();
    currentUser.tokens = currentUser.tokens.concat([{access,token}]);
    
    return currentUser.save().then(()=>{
        return token;
    });
};
UserSchema.pre("save",function(next){
    let currentUser = this;
    
    if(currentUser.isModified("password")){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(currentUser.password,salt,(err,hashedPassword)=>{
                currentUser.password = hashedPassword;
                next();
            });
        });
        
    }
    else{
        next();
    }
})
UserSchema.methods.toJSON = function(){
    let currentUser=this;
    let userObject = currentUser.toObject();
    return _.pick(userObject,["email","_id"]);
};
  
let UserModel = mongoose.model("UserModel",UserSchema);
module.exports = {UserModel};