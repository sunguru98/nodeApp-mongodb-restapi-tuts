let jwt = require("jsonwebtoken");

let userObject = {
    name:"R.Sundeep",
    age:20
};

let encodeJwt = jwt.sign(userObject,"Sundeep1998");
console.log(encodeJwt);

decodedJwt = jwt.verify(encodeJwt,"Sundeep1998");
console.log(decodedJwt);