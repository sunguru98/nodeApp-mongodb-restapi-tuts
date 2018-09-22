let express = require("express");
let bodyParser = require("body-parser");
let {mongoose} = require("./db/db.js");
let {UserModel} = require("./model/UserModel");
let {TodoModel} = require("./model/TodoListModel");
let {ObjectID} = require("mongodb");

let port = process.env.PORT || 3000;
let app = express();
app.use(bodyParser.json());

app.post("/todos",(request,response)=>{
    let noteName = request.body.noteName;
    let newNote = new TodoModel({noteName});
    newNote.save().then(result=>{
        response.send(result);
    },err=>{
        response.status(400).send(err);
    })
});

app.get("/todos",(request,response)=>{
    TodoModel.find().then(results=>{
        response.send({results});
    },err=>{
        response.status(400).send(err);
    })
});

app.get("/todos/:id",(request,response)=>{
    let receivedId = request.params.id;
    if(!ObjectID.isValid(receivedId))
        return response.status(404).send();
    TodoModel.findById(receivedId).then(todo=>{
        if(!todo){
            return response.status(404).send();
        }
        response.send({todo});
    }).catch(e=>{
        return resposne.status(400).send(e);
    });
});

app.listen(port,()=>{
    console.log(`Server Connected to port ${port}`);
});

module.exports = {app};