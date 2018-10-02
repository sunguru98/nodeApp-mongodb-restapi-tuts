let express = require("express");
let bodyParser = require("body-parser");
let {mongoose} = require("./db/db.js");
let {TodoModel} = require("./model/TodoListModel");
let {UserModel} = require("./model/UserModel");
let {ObjectID} = require("mongodb");
let _ = require("lodash");
let {authenticate} = require("./middleware/middleware");

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

app.post("/users",(request,response)=>{
    let userDetails = _.pick(request.body,["email","password"]);
    let newUser = new UserModel(userDetails);
    newUser.save().then(()=>{
        return newUser.generateAuthToken();
    }).then(receivedToken=>{
        response.header("x-auth",receivedToken).send(newUser);
    }).catch(e=>{
        response.status(400).send(e);
        console.log(e);
    })
});


app.get("/users/me",authenticate,(request,response)=>{
   response.send(request.user); 
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
        return response.status(400).send(e);
    });
});

app.delete("/todos/:id",(req,res)=>{
    let receivedId = req.params.id;
    if(!ObjectID.isValid(receivedId))
        return res.status(404).send();
    TodoModel.findByIdAndRemove(receivedId).then(todo=>{
        if(!todo)
            return res.status(404).send();
         res.status(200).send({todo});
    }).catch(e=>{
        return response.status(400).send();
    });

});

app.patch("/todos/:id",(req,res)=>{
    let inputtedId = req.params.id;
    let updatedItemsObject = _.pick(req.body,["noteName","noteCompleted"]);
    if(!ObjectID.isValid(inputtedId))
        return res.status(404).send();
    if(_.isBoolean(updatedItemsObject.noteCompleted) && updatedItemsObject.noteCompleted){
        updatedItemsObject.noteToBeCompletedAt = new Date().getTime();
    }else{
        updatedItemsObject.noteToBeCompletedAt = null;
    }
    TodoModel.findByIdAndUpdate(inputtedId,{$set:updatedItemsObject},{new:true})
        .then((todoResult)=>{
            if(!todoResult)
                return res.status(404).send();
            res.status(200).send({todoResult});
        }).catch(e=>{
            return res.status(400).send();
        })
});

app.listen(port,()=>{
    console.log(`Server Connected to port ${port}`);
});

module.exports = {app};