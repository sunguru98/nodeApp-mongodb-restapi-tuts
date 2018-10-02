let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

let password = "Sundeep1998";
bcrypt.genSalt(20,(err,salt)=>{
    bcrypt.hash(password,salt,(err,result)=>{
        console.log(result);
    })
})

// let userObject = {
//     name:"R.Sundeep",
//     age:20
// };

// let encodeJwt = jwt.sign(userObject,"Sundeep1998");
// console.log(encodeJwt);

// decodedJwt = jwt.verify(encodeJwt,"Sundeep1998");
// console.log(decodedJwt);