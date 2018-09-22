const {mongoose} = require("./../server/db/db");
const {UserModel} = require("./../server/model/UserModel");

let id = "5ba14fcbdbe99e3e7a7f894e";
UserModel.findById(id).then(user=>{
    if(!user)
        return console.log("Id doesnt exist");
    console.log("User",user);
}).catch(e=>console.log(e));

