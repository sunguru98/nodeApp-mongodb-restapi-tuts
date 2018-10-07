let {ObjectID} = require("mongodb");
let {TodoModel} = require("./../../model/TodoListModel");
let {UserModel} = require("./../../model/UserModel");
let jwt = require("jsonwebtoken");

let userOne = new ObjectID();
let userTwo = new ObjectID();

let dummyUsers = [{
    _id: userOne,
    email:"sunguru99@yahoo.co.in",
    password:"Nitya43219",
    tokens:[{
        access:"auth",
        token:jwt.sign({_id:userOne,access:"auth"},"SundeepCharan").toString()
    }]
},{
    _id: userTwo,
    email:"sunguru99@gmail.co.in",
    password:"Nitya43219", 
}]

let dummyTodos = [{
    _id:new ObjectID(),
    noteName:"Hello There"
},{
    _id:new ObjectID(),
    noteName:"Hi Everyone !"
},{
    _id:new ObjectID(),
    noteName:"Goodbye ALL of you present !",
    noteCompleted:true,
    noteToBeCompletedAt:234346,
}];

const populateTodos = (done=>{
    TodoModel.deleteMany({}).then(()=>{
        TodoModel.insertMany(dummyTodos)
    }).then(()=>done());
});

const populateUsers = (done=>{
    UserModel.deleteMany({}).then(()=>{
        let user1Save = new UserModel(dummyUsers[0]).save();
        let user2Save = new UserModel(dummyUsers[1]).save();

        return Promise.all([user1Save,user2Save]);
    }).then(()=>done());
});

module.exports = {
    dummyUsers,dummyTodos,populateTodos,populateUsers
}