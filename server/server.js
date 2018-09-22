let express = require("express");
let bodyParser = require("body-parser");
let {mongoose} = require("./db/db.js");
let {UserModel} = require("./model/UserModel");
let {TodoModel} = require("./model/TodoListModel");


let app = express();
app.use(bodyParser.json());
app.post("/todos",(request,response)=>{
    let noteName = request.body.noteName;
    let newNote = new TodoModel({noteName});
    newNote.save().then(result=>{
        response.send(result);
    },err=>{
        response.status(400).send(err)
    })
});

app.listen(3001,()=>{
    console.log("Server Connected to port 3001");
});


module.exports = {app};