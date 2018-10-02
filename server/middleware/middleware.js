let {UserModel} = require("./../model/UserModel");

let authenticate = (request,response,next)=>{
    let token = request.header("x-auth");
    UserModel.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        request.user = user;
        request.token = token;
        next();

    }).catch(e=>response.status(401).send(e));
}


module.exports = {authenticate};